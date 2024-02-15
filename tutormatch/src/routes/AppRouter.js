import React, { Suspense, Lazy} from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HomePage } from '../pages/Home.js';
import { ProfilePage } from '../pages/Profile.js'
import { AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { ProfileSettingPage, Main, ChangePassword, Schedule, Notification, Info } from "../pages/ProfileSetting.js";


function AppRouter_animated() {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route exact path="/" element={<HomePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/settings" element={<ProfileSettingPage />}>
                    <Route path="schedule" element={<Schedule />} />
                    <Route path="main" element={<Main />} />
                    <Route path="password" element={<ChangePassword />} />
                    <Route path="notification" element={<Notification />} />
                    <Route path="info" element={<Info />} />
                </Route>
            </Routes>
          </AnimatePresence>)
}

function AppRouter() {
    return (
        <Router>
            <AppRouter_animated />
        </Router>
    )
}

export {AppRouter};