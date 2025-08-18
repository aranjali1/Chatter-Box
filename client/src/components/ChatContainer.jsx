import React from "react";
import assets from "../assets/assets.js";

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  return selectedUser ? (
    <div className="flex flex-col h-full bg-black text-white">
      {/* Chat Header */}
      <div className="flex items-center p-3 justify-between border-b border-gray-700 bg-[#0d0d0d]">
        {/* Left: Profile + Name + Status */}
        <div className="flex items-center gap-3">
          <img
            src={assets.profile_martin}
            alt="Profile"
            className="w-10 h-10 rounded-full border border-green-500"
          />
          <div>
            <p className="font-semibold text-white-400">
              {selectedUser.name || "Aniket"}
            </p>
            <span className="flex items-center gap-1 text-sm text-green-500">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
              Online
            </span>
          </div>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-4">
          {/* Back Arrow (mobile only) */}
          <img
            onClick={() => setSelectedUser(null)}
            src={assets.arrow_icon}
            alt="Arrow Icon"
            className="w-6 h-6 cursor-pointer md:hidden hover:opacity-70 transition invert"
          />
          {/* Help Icon (desktop only) */}
          <img
            src={assets.help_icon}
            alt="Help Icon"
            className="w-6 h-6 hidden md:block cursor-pointer hover:opacity-70 transition invert"
          />
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <p>Start chatting with {selectedUser.name || "Aniket"}...</p>
      </div>
    </div>
  ) : (
    // Welcome screen
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 bg-black">
      <img
        src={assets.logo_cion}
        alt="Logo"
        className="w-20 h-20 invert"
      />
      <p className="text-lg font-medium text-green-400">
        Welcome to <span className="text-white">ChatterBox</span>
      </p>
      <p className="text-sm text-gray-500">Chat anytime, anywhere.</p>
    </div>
  );
};

export default ChatContainer;
