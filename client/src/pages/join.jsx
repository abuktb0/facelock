import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router";
import axios from "axios";
import { useAuth } from "../contexts/useAuth";
import toast from "react-hot-toast";

const Join = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  const { backendUrl, setIsLoggedIn, getUserData } = useAuth();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;
      if (params.state === "signup") {
        const { data } = await axios.post(backendUrl + "/auth/register", {
          name,
          username,
          email,
          password,
        });
        if (data.success) {
          setIsLoggedIn(true);
          getUserData()
          navigate("/");
          toast.success("Sign Up successfully");
        } else {
          toast.error(data);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/auth/login", {
          email,
          password,
        });
        if (data.success) {
          setIsLoggedIn(true);
          getUserData()
          navigate("/");
          toast.success("login successfully");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-cyan-900 flex flex-col items-center justify-center text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-cyan-800 p-6 md:p-10 rounded-2xl shadow-2xl flex flex-col justify-center items-start gap-2 w-full max-w-sm"
      >
        <h1 className="text-xl w-full text-center">
          {params.state === "signup" ? "Join to FaceLock" : "Login to FaceLock"}
        </h1>
        {params.state === "signup" ? (
          <div className="w-full">
            <label htmlFor="name">name</label>
            <div className="px-2 flex justify-center items-center w-full bg-cyan-300 rounded text-black">
              <IoClose
                className={`cursor-pointer text-lg  ${
                  name === "" ? "invisible" : "block"
                }`}
                onClick={() => setName("")}
              />
              <input
                type="text"
                placeholder="name"
                id="name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="w-full outline-none py-1.5 px-2 "
              />
            </div>
          </div>
        ) : (
          <></>
        )}
        {params.state === "signup" ? (
          <div className="w-full">
            <label htmlFor="username">username</label>
            <div className="px-2 flex justify-center items-center w-full bg-cyan-300 rounded text-black">
              <IoClose
                className={`cursor-pointer text-lg  ${
                  username === "" ? "invisible" : "block"
                }`}
                onClick={() => setUsername("")}
              />
              <input
                type="text"
                placeholder="username"
                id="username"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                className="w-full outline-none py-1.5 px-2 "
              />
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className="w-full">
          <label htmlFor="email">email</label>
          <div className="px-2 flex justify-center items-center w-full bg-cyan-300 rounded text-black">
            <IoClose
              className={`cursor-pointer text-lg  ${
                email === "" ? "invisible" : "block"
              }`}
              onClick={() => setEmail("")}
            />
            <input
              type="email"
              placeholder="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full outline-none py-1.5 px-2 "
            />
          </div>
        </div>
        <div className="w-full">
          <label htmlFor="password">password</label>
          <div className="px-2 flex justify-center items-center w-full bg-cyan-300 rounded text-black">
            <IoClose
              className={`cursor-pointer text-lg  ${
                password === "" ? "invisible" : "block"
              }`}
              onClick={() => setPassword("")}
            />
            <input
              type={show ? "text" : "password"}
              placeholder="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full outline-none py-1.5 px-2 "
            />
            {password === "" ? (
              <></>
            ) : (
              <>
                {show ? (
                  <FaRegEyeSlash
                    onClick={() => setShow(!show)}
                    className="text-xl cursor-pointer"
                  />
                ) : (
                  <FaRegEye
                    onClick={() => setShow(!show)}
                    className="text-xl cursor-pointer"
                  />
                )}
              </>
            )}
          </div>
        </div>
        {params.state === "signup" ? (
          <p className="text-sm text-white/50">
            you have account?{" "}
            <span className="underline">
              <Link to={"/join/login"}>login here</Link>
            </span>
          </p>
        ) : (
          <p className="text-sm text-white/50">
            you dont have account?{" "}
            <span className="underline">
              <Link to={"/join/signup"}>sign up here</Link>
            </span>
          </p>
        )}
        {params.state === "signup" ? (
          <></>
        ) : (
          <button onClick={() => navigate("/reset-password")} className="text-sm text-white/50 hover:text-white/80 cursor-pointer">Forgot password?</button>
        )}
        <button
          onSubmit={handleSubmit}
          className="px-8 py-2 bg-cyan-950 text-white rounded cursor-pointer duration-300 hover:bg-cyan-900"
        >
          {params.state === "signup" ? "Sign Up" : "login"}
        </button>
      </form>
    </div>
  );
};

export default Join;
