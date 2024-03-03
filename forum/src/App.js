import React from "react";
import Home from "./pages/home/Home.jsx";
import Profile from "./pages/profile/Profile.jsx";
import {
  BrowserRouter as Router,
  Switch,
  Route,

} from "react-router-dom";

const App = () => {
    return (
        <Router>
            <Switch>

              <Route exact path="/">
                <Home />
              </Route>

              <Route path="/mertkaan">
                <Profile />
              </Route>
              
            </Switch>
        </Router>
    )
}

export default App;