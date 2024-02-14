import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HomePage } from '../pages/Home.js';
import { ProfilePage } from '../pages/Profile.js'

function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<HomePage />} />
                <Route path="/Profile" element = {<ProfilePage />} />
            </Routes>
        </Router>
    );
}

export {AppRouter};