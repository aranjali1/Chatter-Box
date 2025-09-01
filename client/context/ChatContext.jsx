import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";
import axios from "axios";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { token, socket } = useContext(AuthContext);

  const [msg, setMsg] = useState([]);
  const [users, setUsers] = useState([]); // ✅ all users for sidebar
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMsg, setUnseenMsg] = useState({});

  // ✅ fetch users for sidebar
  const getUsers = async () => {
    try {
      const { data } = await axios.get(`/api/msg/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getMsgs = async (userId) => {
    try {
      const { data } = await axios.get(`/api/msg/${userId}`);
      if (data.success) {
        setMsg(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const sendMsg = async (msgData) => {
    try {
      const { data } = await axios.post(`/api/msg/send/${selectedUser._id}`, msgData);
      if (data.success) {
        await getMsgs(selectedUser._id); // reload all messages after sending
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const subscribeToMsg = async () => {
    if (!socket) return;

    // we are subscribing(listening) to newMsg from server, any user sends a msg the backend emits newMsg, frontend hears it because it is subscribed, then setmsg is updated
    // if we dont subscribe we cant get live msgs we can only see new msg if we refresh or made an api call.
    socket.on("newMsg", (newMsg) => {
      if (selectedUser && newMsg.senderId === selectedUser._id) {
        newMsg.isSeen = true;
        setMsg((prevmsg) => [...(prevmsg || []), newMsg]);
        axios.put(`/api/msgs/mark/${newMsg._id}`);
      } else {
        setUnseenMsg((prevUnseenMsg) => ({
          ...prevUnseenMsg,
          [newMsg.senderId]: (prevUnseenMsg[newMsg.senderId] || 0) + 1,
        }));
      }
    });
  };

  const unsubscribeFromMsg = () => {
    if (socket) socket.off("newMsg");
  };

  useEffect(() => {
    subscribeToMsg();
    return () => unsubscribeFromMsg();
  }, [socket, selectedUser]);

  const value = {
    msg,
    users,             // ✅ sidebar user list
    selectedUser,
    unseenMsg,
    getUsers,          // ✅ fetch users
    setMsg,
    sendMsg,
    setSelectedUser,
    setUnseenMsg,
    getMsgs,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
