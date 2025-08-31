import React, { useContext, useState, useEffect } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

const Sidebar = () => {
  const { getUsers, user = [], selectedUser, setSelectedUser, unseenMsg = {}, setUnseenMsg } = useContext(ChatContext);
  const { logout, onlineUsers = [] } = useContext(AuthContext);

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Filter users based on search input
  const filteredUsers = search
    ? user.filter((u) => u.fullName?.toLowerCase().includes(search.toLowerCase()))
    : user;

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  return (
    <div className={`${selectedUser ? "max-md:hidden" : ""} h-full flex flex-col bg-neutral-950 p-3`}>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4 relative">
        <h2 className="text-green-400 font-bold text-xl">CHATTER BOX</h2>

        {/* Menu icon */}
        <div className="relative">
          <img
            src={assets.menu_icon}
            alt="Menu Icon"
            className="w-6 h-6 cursor-pointer hover:opacity-80"
            onClick={() => setMenuOpen((prev) => !prev)}
          />

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 space-y-2 bg-neutral-900 p-3 rounded-lg shadow-lg border border-green-500/30 z-10">
              <p className="cursor-pointer hover:text-green-400">Edit Profile</p>
              <hr className="border-green-500/30" />
              <p className="cursor-pointer hover:text-red-500" onClick={logout}>
                Logout
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Search bar */}
      <div className="flex items-center bg-neutral-800 rounded-lg px-3 py-2 mb-4 border border-green-500/30">
        <img src={assets.search_icon} alt="Search" className="w-5 h-5 mr-2" />
        <input
          type="text"
          placeholder="Search User..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none text-sm text-white w-full placeholder-gray-400"
        />
      </div>

      {/* User list */}
      <div className="space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-green-500/40 pr-2">
        {filteredUsers.map((u, index) => (
          <div
            key={u._id || index}
            onClick={() => {
              setSelectedUser(u);
              setUnseenMsg((prev) => ({ ...prev, [u._id]: 0 }));
              getMsgs(u._id);
            }}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
              selectedUser?._id === u._id ? "bg-green-900/40 border border-green-900/40" : "hover:bg-neutral-800"
            }`}
          >
            <img
              src={u?.profilePic || assets.avatar_icon}
              alt="avatar"
              className="w-10 h-10 rounded-full border border-green-500/30"
            />
            <div className="flex-1">
              <p className="font-medium text-white">{u?.fullName || "Unknown"}</p>
              <span className={`text-xs ${onlineUsers.includes(u._id) ? "text-green-400" : "text-gray-500"}`}>
                {onlineUsers.includes(u._id) ? "Online" : "Offline"}
              </span>
            </div>
            {unseenMsg[u._id] > 0 && <span className="text-gray-400 text-xs">{unseenMsg[u._id]}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
