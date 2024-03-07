import "../html/HomeStyles.css";
import { Navbar } from "../components/Navbar";
import { SearchResult } from "../components/Searching_result";

import Home from "../pages/home/Home.jsx";
import {
  BrowserRouter as Router,
  Route,

} from "react-router-dom";

function HomePage() {
  return (
    <>
      <div className="home-page">
        <Navbar />
        <div className="home">
          {/* <h3>٩( ᐛ )و</h3> */}
              <Home />
        </div>
      </div>
    </>
  );
}

export { HomePage };
