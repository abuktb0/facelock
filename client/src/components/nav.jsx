import React from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../contexts/useAuth";
import axios from "axios";
import toast from "react-hot-toast";

const nav = () => {
  const navigate = useNavigate();
  const { userData, setUserData, backendUrl, setIsLoggedIn } = useAuth();
  const email = userData?.email;
  const logoutHandle = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/auth/logout");
      if (data.success) {
        toast.success("logout successfully");
        setIsLoggedIn(false);
        setUserData(false);
      } else {
        toast.error("logout failed");
      }
    } catch (error) {
      toast.error(error);
    }
  };
  const sendVerifyToken = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/auth/send-verify-token");
      if (data.success) {
        toast.success("Check your email");
        navigate("/verify-account");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const resetPasswordHandle = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/auth/send-reset-token", {
        email,
      });
      if (data.success) {
        toast.success(data.message);
        navigate("/reset-password");
      } else {
        toast.error(data.message)
      };
    } catch (error) {
      toast.error(error.message)
    }
  };
  return (
    <div className="h-14 bg-cyan-950 text-white w-full flex justify-between items-center px-2 absolute">
      <Link to={"/"} className="text-xl">
        <span className="text-cyan-400 font-bold">F</span>aceLock
      </Link>
      {userData ? (
        <div>
          <div className="flex justify-center items-center relative gap-1 group">
            <div className="size-8 bg-cyan-300 text-black flex justify-center items-center rounded-full text-xl">
              {" "}
              {userData.name.charAt(0).toUpperCase()}{" "}
            </div>
            <div className="group-hover:block hidden absolute top-8 right-0 bg-cyan-950 px-2 py-3 ">
              {!userData.isVerify && (
                <button
                  onClick={sendVerifyToken}
                  className="hover:text-white/50 cursor-pointer"
                >
                  verifyEmail
                </button>
              )}

              <button
                onClick={logoutHandle}
                className="hover:text-white/50 cursor-pointer"
              >
                logout
              </button>
              <button
                onClick={resetPasswordHandle}
                className="hover:text-white/50 cursor-pointer"
              >
                ResetP
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/join/signup")}
            className="cursor-pointer px-4 py-1 bg-cyan-700 rounded-lg hover:bg-cyan-500 duration-300"
          >
            Sign up
          </button>
          <button
            onClick={() => navigate("/join/login")}
            className="cursor-pointer px-4 py-1 rounded-lg"
          >
            login
          </button>
        </div>
      )}
    </div>
  );
};

export default nav;
