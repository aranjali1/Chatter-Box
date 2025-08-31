import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import RightBar from "../components/RightBar";

const Home = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="w-full h-screen bg-black text-white sm:px-[10%] sm:py-[5%]">
      {/* Main container */}
      <div
        className={`grid h-full min-h-0 rounded-2xl shadow-[0_0_25px_rgba(34,197,94,0.3)] overflow-hidden bg-neutral-950 
          ${
            selectedUser
              ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
              : "md:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_3fr]"
          }`}
      >
        {/* Sidebar */}
  <div className="bg-neutral-950 border-r border-green-500/30 p-4 min-h-0 h-full">
          <Sidebar/>
        </div>

        {/* Chat container */}
  <div className="bg-neutral-900 border-x border-green-500/20 h-full min-h-0">
          <ChatContainer/>
        </div>

        {/* Right bar (only visible when a user is selected) */}
            <RightBar/>

      </div>
    </div>
  );
};

export default Home;
