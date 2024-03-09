import React, { Suspense, Lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/Home.js";
import { LoginSignup } from "./pages/Login.js";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { RegistrationPage } from "./pages/Registration.js";
import OthersProfile from "./pages/Profile2.js";
import ChatBody from "./pages/ChatBody.js";
import { UserRegistrationInfo } from "./pages/UserRegistrationInfo.js";
import "./App.css";
import { UserProvider } from "./userContext.js";
import { ProfilePage } from "./pages/Profile.js";

import {
  ProfileSettingPage,
  Main,
  Info,
  ChangePassword,
  Schedule,
  Notification
  
} from "./pages/ProfileSetting.js";

import Forum from "./pages/Forum.js";
import CreatePost from "./components/CreatePost.js";


function AppRouter(){
  const location = useLocation();
  return (
    <UserProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route exact path="/" element={<LoginSignup />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/info" element={<UserRegistrationInfo />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile-setting" element={<ProfileSettingPage />}>
            <Route path="schedule" element={<Schedule />} />
            <Route path="main" element={<Main />} />
            <Route path="password" element={<ChangePassword />} />
            <Route path="notification" element={<Notification />} />
            <Route path="info" element={<Info />} />
            {/* Add other nested routes under /profile-setting here */}
          </Route>
          <Route path="/profile" element={<ProfilePage/>}/>
          <Route path="/otherprofile" element={<OthersProfile/>}/>
          <Route path="/chat" element={<ChatBody/>}/>
          <Route path="/forum" element={<Forum />}/>
          <Route path="/post" element={<CreatePost/>}/>
        </Routes>
      </AnimatePresence>
    </UserProvider>
  );
}

function App() {
  return (
    <div className="App">
      <Router>
        <AppRouter />
      </Router>
    </div>
  );
}

export default App;
