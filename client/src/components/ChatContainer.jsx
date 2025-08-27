import React, { useState, useRef, useEffect } from "react";
import assets, { messagesDummyData } from "../assets/assets.js";
import { formatMessageTime } from "../lib/utils.js";

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const [messages, setMessages] = useState(messagesDummyData);
  const [newMessage, setNewMessage] = useState("");

  // ✅ Ref for auto-scroll
  const messagesEndRef = useRef(null);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const newMsg = {
      _id: Date.now().toString(),
      senderId: "me",
      receiverId: selectedUser._id,
      text: newMessage,
      seen: false,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");
  };

  // ✅ Auto-scroll on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return selectedUser ? (
  <div className="flex flex-col h-full min-h-0">
      {/* Chat Header */}
  <div className="flex-shrink-0 flex items-center px-4 py-3 justify-between border-b border-gray-800 bg-[#0d0d0d] sticky top-0 z-10">
        {/* ... header content ... */}
      </div>

      {/* Chat Messages */}
  <div className="flex-1 overflow-y-auto p-3 pb-6 chat-scrollbar flex flex-col gap-y-2">
        {messages.map((msg) => {
          const isMe = msg.senderId === "me";
          return (
            <div
              key={msg._id}
              className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs break-words ${
                  isMe
                    ? "bg-green-800 text-white rounded-br-none"
                    : "bg-gray-800 text-gray-200 rounded-bl-none"
                }`}
              >
                {msg.text && <>
                  <p>{msg.text}</p>
                  <span className="block text-xs text-gray-400 mt-1">
                    {formatMessageTime(msg.createdAt)}
                  </span>
                </>}
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="sent media"
                    className="rounded-lg max-w-[200px] mt-1"
                  />
                )}
              </div>
            </div>
          );
        })}

        {/* ✅ Dummy div for auto-scroll */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-[#0d0d0d] border-t border-gray-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-neutral-900 text-white px-4 py-2 rounded-full focus:outline-none border border-gray-700"
          />
          <input type="file" id="image" accept="image/*" hidden/>
          <label htmlFor="image" className="cursor-pointer">
            <img src={assets.gallery_icon} alt=""/>
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
  ) : (
    <div className="flex items-center justify-center h-full text-gray-500">
      Select a user to start chatting
    </div>
  );
};

export default ChatContainer;
