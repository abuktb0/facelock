import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/home";
import Nav from "./components/nav";

import Join from "./pages/join";
import { Toaster } from "react-hot-toast";
import VerifyAccount from './pages/verifyAccount';
import ResetP from './pages/resetP';

const App = () => {
  return (
    <BrowserRouter>
      <Nav />
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join/:state" element={<Join />} />
        <Route path="/verify-account" element={<VerifyAccount />} />
        <Route path="/reset-password" element={<ResetP />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
