import React, { useState, useRef, useEffect, useContext } from "react";
import { formatMessageTime } from "../lib/utils.js";
import { AuthContext } from "../../context/AuthContext.jsx";
import { ChatContext } from "../../context/ChatContext.jsx";
import { toast } from "react-hot-toast";
import assets from "../assets/assets.js";

const ChatContainer = () => {
  const messagesEndRef = useRef(null);

  const { msg, selectedUser, sendMsg, getMsgs } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState("");

  // Send text message
  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    await sendMsg({ text: input.trim() });
    setInput("");
  };

  // Send image
  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select a valid image");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
  await sendMsg({ media: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  // Auto-scroll on new messages
  useEffect(() => {
    if (messagesEndRef.current && (msg?.length ?? 0) > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [msg]);

  // Load messages when a user is selected
  useEffect(() => {
    if (selectedUser?._id) {
      getMsgs(selectedUser._id);
    }
  }, [selectedUser]);

  // If no user selected
  if (!selectedUser) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a user to start chatting
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Chat Header */}
      <div className="flex-shrink-0 flex items-center px-4 py-3 justify-between border-b border-gray-800 bg-[#0d0d0d] sticky top-0 z-10">
        <div className="flex items-center gap-3">
          {selectedUser?.profilePic ? (
            <img
              src={selectedUser.profilePic}
              alt={selectedUser.fullName}
              className="w-10 h-10 rounded-full object-cover border border-gray-700"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white">
              {selectedUser?.fullName?.charAt(0) || "?"}
            </div>
          )}
          <div>
            <p className="font-medium text-white">{selectedUser.fullName}</p>
            <span
              className={`text-xs ${
                onlineUsers.includes(selectedUser._id)
                  ? "text-green-500"
                  : "text-gray-400"
              }`}
            >
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-3 pb-6 chat-scrollbar flex flex-col gap-y-2">
        {(msg ?? []).map((message, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 ${
              message.senderId === authUser._id ? "flex-row-reverse" : ""
            }`}
          >
            {message.image ? (
              <img
                src={message.image || undefined}
                alt="message"
                className="max-w-[200px] rounded-lg"
              />
            ) : (
              <p className="bg-gray-800 text-white px-3 py-2 rounded-lg">
                {message.text}
              </p>
            )}
            <span className="block text-xs text-gray-400 mt-1">
              {formatMessageTime(message.createdAt)}
            </span>
          </div>
        ))}

        {/* Dummy div for auto-scroll */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-[#0d0d0d] border-t border-gray-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            onKeyDown={(e) => (e.key === "Enter" ? handleSend(e) : null)}
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-neutral-900 text-white px-4 py-2 rounded-full focus:outline-none border border-gray-700"
          />
          <input
            type="file"
            id="image"
            onChange={handleSendImage}
            accept="image/*"
            hidden
          />
          <label htmlFor="image" className="cursor-pointer">
            <img src={assets.gallery_icon} alt="upload" />
          </label>
          <button
            onClick={handleSend}
            className="bg-green-800 hover:bg-green-600 transition px-4 py-2 rounded-full text-white font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
