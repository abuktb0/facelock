import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/useAuth";
import axios from "axios";
import toast from "react-hot-toast";

const resetP = () => {
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState("Send");
  const { userData, isLoggedIn, backendUrl } = useAuth();
  const [email, setEmail] = useState(isLoggedIn ? userData?.email : "");
  const [password, setPassword] = useState();

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/auth/reset-token", {
        email,
        otp: token,
        newPassword: password,
      });
      if (data.success) {
        toast.success(data.message);
        isLoggedIn ? navigate("/") : navigate("/join/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const sendResetToken = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(backendUrl + "/auth/send-reset-token", {
        email,
      });
      if (data.success) {
        toast.success(data.message);
        navigate("/reset-password");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="h-screen w-full bg-cyan-800 flex justify-center items-center">
      <form
        onSubmit={onSubmit}
        className="text-white py-10 px-20 bg-cyan-950 flex flex-col gap-4 justify-center items-center"
      >
        <h1 className="text-2xl">ResetPassword token</h1>
        {!isLoggedIn && (
          <div className="flex justify-center items-center gap-2">
            <input
              type="email"
              className="text-center text-2xl tracking-widest px-4 py-2 rounded-xl bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 no-spinner"
              placeholder="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <button
              onClick={sendResetToken}
              className="bg-white/30 hover:bg-white/20 cursor-pointer px-4 py-2 rounded-lg"
            >
              SendToken
            </button>
          </div>
        )}
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
        <input
          type="password"
          className="text-center text-2xl tracking-widest px-4 py-2 rounded-xl bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 no-spinner w-full"
          placeholder="New Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        <button
          onClick={onSubmit}
          className="px-10 py-2 bg-cyan-800 rounded-2xl cursor-pointer hover:bg-cyan-700"
        >
          {loading}
        </button>
      </form>
    </div>
  );
};

export default resetP;
