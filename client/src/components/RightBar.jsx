import React, { useContext } from 'react'
import assets, { imagesDummyData } from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const RightBar = ({ selectedUser }) => {

  const {logout}=useContext(AuthContext);
  return (
    selectedUser && (
      <div className="bg-neutral-950 border-l border-green-500/30 p-4 h-full w-72 flex flex-col">
        {/* Profile Section */}
        <div className="flex flex-col items-center text-center space-y-2 mb-4">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt=""
            className="w-20 h-20 rounded-full border-2 border-green-500/50 object-cover"
          />
          <h1 className="text-lg font-semibold text-white">
            {selectedUser?.fullName}
          </h1>
          <p className="text-sm text-gray-400">{selectedUser.bio}</p>
        </div>

        <hr className="border-green-500/30 mb-4" />

        {/* Media Section */}
        <div className="flex-1 overflow-y-auto">
          <p className="text-sm text-green-400 font-medium mb-2">Media</p>
          <div className="grid grid-cols-3 gap-2">
            {imagesDummyData.map((url, index) => (
              <div
                key={index}
                onClick={() => window.open(url)}
                className="cursor-pointer rounded-lg overflow-hidden group"
              >
                <img
                  src={url}
                  alt=""
                  className="w-full h-20 object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <button className="mt-4 w-full bg-green-700 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-colors duration-200" onClick={()=>logout()}>
          Logout
        </button>
      </div>
    )
  )
}

export default RightBar
