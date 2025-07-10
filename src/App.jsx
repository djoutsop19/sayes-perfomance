import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Me from "./components/Me";
import Fitness from "./components/Fitness";
import Players from "./components/Players";
import AdminDashboard from "./components/AdminDashboard"
import CreateClass from "./components/CreateClass"
import EditClass from "./components/EditClass"
import BookingsPage from "./components/BookingsPage"
import UserPage from "./components/UserPage"
import LandingPage from "./components/LandingPage"
import PackagesPage from "./components/PackagesPage"
import Login from "./components/Login"
import Register from"./components/Register"
import VerifyModal from"./components/VerifyModal"
import AdminRegister from"./components/AdminRegister"
import AdminLogin from"./components/AdminLogin" 

// Tu ajouteras ensuite Reservations et Players ici

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/fitness" element={<Fitness />} />
        <Route path="/players" element={<Players />} />
        {/* <Route path="/ " element={<Players />} /> */}
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/editClass" element={<EditClass />} />
        <Route path="/CreateClass" element={<CreateClass />} />
        <Route path="/BookingsPage" element={<BookingsPage />} />
        <Route path="/UserPage" element={<UserPage />} />
        <Route path="/LandingPage" element={<LandingPage />} />
        <Route path="/PackagesPage" element={<PackagesPage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/VerifyModal" element={<VerifyModal />} />
        <Route path="/me" element={<Me />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        
      </Routes>
    </Router>
  );
}

export default App;
