import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../contexts/useAuth";

const home = () => {
  const { userData, getUserData } = useAuth();
  return (
    <div className="h-screen w-full bg-cyan-900 flex justify-center items-center text-white flex-col gap-4">
      <h1 className="text-3xl font-mono">
        Welcome {userData ? userData.name : "developer"}
      </h1>
      <p className="text-lg font-mono">
        Whaaat? you not have any account in facelock?{" "}
        <span className="underline text-cyan-200 hover:text-cyan-50">
          <Link to="/join/signup">Sign up here</Link>
        </span>
      </p>
    </div>
  );
};

export default home;
