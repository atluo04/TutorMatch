import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HomePage } from '../pages/Home';

function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<HomePage />} />
            </Routes>
        </Router>
    );
}

export {AppRouter};

