import React from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import Home from "../../pages/Home";
import Profil from "../../pages/Profil";
import Trending from "../../pages/Trending";

const index = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" exact element={<Home/>} />
          <Route path="/profil" exact element={<Profil/>} />
                  <Route path="/trending" exact element={<Trending/>} />
                  <Route path="*" element={<Navigate to="/" replace />}/>
        </Routes>
      </Router>
    </div>
  );
};

export default index;
