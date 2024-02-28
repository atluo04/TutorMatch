import { MenuData } from "./MenuData";
import "./NavbarStyles.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { SearchResult } from "./Searching_result";


function Navbar() {
  const [clicked, setClicked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  // const test = "123456";
  //console.log('y')
  const handleSearch = async () => {
   console.log('ya')
    const q = query(collection(db, "posts"), where("title", "==", searchQuery));
    const querySnapshot = await getDocs(q);
    const results = [];
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data())
      results.push({ id: doc.id, ...doc.data() });
    });

    setSearchResults(results);
  };

  const handleClick = () => {
    setClicked(!clicked);
  };

  return (
    <nav className="NavbarItems">
      <h1 className="logo">
        TutorMatch <i className="fab fa-react"></i>
      </h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="..."
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
        />
        <button type="submit" onClick={handleSearch}>
          Search
          <i className="fas fa-search"></i>
        </button>
      </div>
      <div className="menu-icons" onClick={handleClick}>
        <i className={clicked ? "fas fa-times" : "fas fa-bars"}></i>
      </div>
      <ul className={clicked ? "nav-menu active" : "nav-menu"}>
        {MenuData.map((item, index) => {
          return (
            <li key={index}>
              <Link to={item.url} className={item.cName}>
                <i className={item.icon}></i>
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
      <SearchResult results={searchResults}/>
    </nav>
    
  );
}

export { Navbar };
