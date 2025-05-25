import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../contexts/useAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const verifyAccount = () => {
  const [token, setToken] = useState("");
  const { backendUrl, isLoggedIn, getUserData } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState("Send");
  const onSubmit = async (e) => {
    console.log(token)
    try {
      setLoading("loading....");
      e.preventDefault();
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/auth/verify-token", {
        otp: token,
      });
      if (data.success) {
        toast.success(data.message);
        getUserData()
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading("Send");
    }
  };
  return (
    <div className="h-screen w-full bg-cyan-800 flex justify-center items-center">
      {isLoggedIn ? (
        <form
          onSubmit={onSubmit}
          className="text-white py-10 px-20 bg-cyan-950 flex flex-col gap-4 justify-center items-center"
        >
          <h1 className="text-2xl">Verify Token</h1>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            className="text-center text-2xl tracking-widest px-4 py-2 rounded-xl bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 no-spinner w-full"
            placeholder="••••••"
            onChange={(e) => setToken(e.target.value)}
            value={token}
          />

          <button
            onClick={onSubmit}
            className="px-10 py-2 bg-cyan-800 rounded-2xl cursor-pointer hover:bg-cyan-700"
          >
            {loading}
          </button>
        </form>
      ) : (
        <div className="text-white flex justify-center items-center flex-col gap-8">
          <h1 className="text-3xl">You are not allowed to be here</h1>
          <button
            onClick={() => navigate("/join/signup")}
            className="px-10 py-2 bg-cyan-950 rounded hover:bg-cyan-900 cursor-pointer"
          >
            Go to sign up
          </button>
        </div>
      )}
    </div>
  );
};

export default verifyAccount;
