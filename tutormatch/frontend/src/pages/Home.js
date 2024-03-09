import "../html/HomeStyles.css";
import { Navbar } from "../components/Navbar";
import Home from "../html/home/Home.jsx"
import { useState } from "react";

function HomePage() {
  const [searchResults, setSearchResults] = useState([]);
  const [look_for, setLook_for] = useState("");

  return (
    <>
      <div className="home-page">
        <Navbar setResults={setSearchResults} setLook_for={setLook_for}/>
        <div className="home">
          {searchResults.length === 0 && (
            <h1>Try searching for something</h1>
          )}
          <Home searchResults={searchResults} look_for={look_for}/>
        </div>
      </div>
    </>
  );
}

export { HomePage };
