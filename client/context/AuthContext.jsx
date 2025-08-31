import { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client"; //used to create a new client side websocket connection to our backend

const backendURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendURL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null); //holds the current socket connection object, when connectsocket is called it gets replaced by an actual socket connection

  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message);
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setAuthUser(null);
    setOnlineUsers([]);
    delete axios.defaults.headers.common["token"];
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    toast.success("Logged out successfully");
  };

  //connecting socket
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;//if no logged in user/if socket already exists and connected->dont reconnect


    //create new socket connection
    const newSocket = io(backendURL, {//create new socket pointing to backend url
      query: { userId: userData._id },//adds extra info to the connection, this is sent during the initial handshake
    });

    setSocket(newSocket);//store the new socket connection in state

    //listening to events from server
    newSocket.on("getOnlineUsers", (users) => {//register an event listener for getOnlineUsers event
      setOnlineUsers(users);
    });
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
      checkAuth();
    }

    return () => {
      if (socket) socket.disconnect();//cleanup function to disconnect socket when component unmounts,prevents memory leaks,duplicate connections, ghost users still showing as online after logout
    };
  }, [token]);

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};


//io(...) opens the connection
//query->tells server "this is the user connecting"
//.on(...) listens to events from server
//.disconnect() cleanly shuts down the connection