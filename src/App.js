import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer, Flip } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Login from "./components/Login";
import Home from "./container/Home";
import "./App.css";
import { fetchUser } from "./utils/fetchUser";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = fetchUser();

    if (user === null) navigate("/login");
  }, []);

  return (
    <>
      <ToastContainer
        stacked
        position="top-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable={"mouse"}
        pauseOnHover
        theme="colored"
        transition={Flip}
      />
      <Routes>
        <Route path="/*" element={<Home />} />
        {/* for non-defined path the application is directed to home */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
