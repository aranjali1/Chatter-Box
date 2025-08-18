import React, { useState } from "react";
import assets, { userDummyData } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ selectedUser, setSelectedUser }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  // filter users based on search
  const filteredUsers = userDummyData.filter((user) =>
    user.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className={`${
        selectedUser ? "max-md:hidden" : ""
      } h-full flex flex-col bg-neutral-950 p-3`}
    >
      {/* Top bar (title + menu icon) */}
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

          {/* Dropdown menu below the icon */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 space-y-2 bg-neutral-900 p-3 rounded-lg shadow-lg border border-green-500/30 z-10">
              <p className="cursor-pointer hover:text-green-400">Edit Profile</p>
              <hr className="border-green-500/30" />
              <p
                className="cursor-pointer hover:text-red-500"
                onClick={() => navigate("/login")}
              >
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
        {filteredUsers.map((user, index) => (
          <div
            key={index}
            onClick={() => setSelectedUser(user)}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
              selectedUser?._id === user._id
                ? "bg-green-900/40 border border-green-500/40"
                : "hover:bg-neutral-800"
            }`}
          >
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt="avatar"
              className="w-10 h-10 rounded-full border border-green-500/30"
            />
            <div className="flex-1">
              <p className="font-medium text-white">{user?.fullName}</p>
              <span
                className={`text-xs ${
                  index < 3 ? "text-green-400" : "text-gray-500"
                }`}
              >
                {index < 3 ? "Online" : "Offline"}
              </span>
            </div>
            {index > 2 && (
              <span className="text-gray-400 text-xs">{index}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
