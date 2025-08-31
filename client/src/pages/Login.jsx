import React, { useState } from "react";
import assets from "../assets/assets";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [currState, setCurrState] = useState("signup");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const {login}=useContext(AuthContext);
  const navigate=useNavigate();

  const onSubmitHandler = async(e) => {
    e.preventDefault();
    if (currState === "signup" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    const success=await login(currState==="signup"?"signup":"login",{fullName,email,password,bio,profilePic});
  if(success) navigate("/", { replace: true });

    console.log("Form submitted",{fullName,email,password,bio,profilePic});
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-950 px-4">
      <div className="bg-neutral-900 border border-green-600/30 rounded-2xl shadow-lg w-full max-w-md p-8">
        {/* Title */}
        <h1 className="text-3xl font-bold text-green-500 text-center mb-6">
          Chatter Box
        </h1>

        {/* Form */}
        <form onSubmit={onSubmitHandler} className="space-y-4">
          {/* Form Title */}
          <h2 className="flex items-center justify-center gap-2 text-xl font-semibold text-white">
            {currState === "signup" ? "Sign Up" : "Login"}
          </h2>

          {/* Full Name (only for signup before submit) */}
          {currState === "signup" && !isDataSubmitted && (
            <input
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
              type="text"
              placeholder="Full Name"
              required
              className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none"
            />
          )}

          {/* Email + Password */}
          {!isDataSubmitted && (
            <>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email Address"
                required
                className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none"
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
                required
                className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none"
              />
            </>
          )}

          {/* Bio + Profile Pic (after submit on signup) */}
          {currState === "signup" && isDataSubmitted && (
            <>
              <textarea
                onChange={(e) => setBio(e.target.value)}
                value={bio}
                rows={4}
                placeholder="Provide a short bio..."
                required
                className="w-full px-4 py-2 mt-2 rounded-lg bg-neutral-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none resize-none"
              />

              {/* Profile Picture (optional) */}
              <h3 className="text-white font-medium mb-1">
      Upload Profile Picture <span className="text-gray-400 text-sm">(optional)</span>
    </h3>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePic(e.target.files[0])}
                className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none file:cursor-pointer file:bg-green-600 file:text-white file:border-none file:px-3 file:py-1 file:rounded-lg"
              />
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 transition py-2 rounded-lg text-white font-medium"
          >
            {currState === "signup"
              ? isDataSubmitted
                ? "Finish Signup"
                : "Create Account"
              : "Login"}
          </button>

          {/* Terms */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
            <input type="checkbox" className="accent-green-600" />
            <p>
              Agree to the{" "}
              <span className="text-green-500 cursor-pointer hover:underline">
                terms of use
              </span>{" "}
              &{" "}
              <span className="text-green-500 cursor-pointer hover:underline">
                privacy policy
              </span>
              .
            </p>
          </div>

          {/* Toggle between login/signup */}
          <div className="flex flex-col gap-2 items-center mt-4">
            {currState === "signup" ? (
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <span
                  onClick={() => {
                    setCurrState("login");
                    setIsDataSubmitted(false);
                  }}
                  className="font-medium text-green-500 cursor-pointer hover:underline"
                >
                  Login here
                </span>
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                Create an account{" "}
                <span
                  onClick={() => {
                    setCurrState("signup");
                    setIsDataSubmitted(false);
                  }}
                  className="font-medium text-green-500 cursor-pointer hover:underline"
                >
                  Click here
                </span>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
