import { MenuData } from "./MenuData";
import "./NavbarStyles.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { SearchResult } from "./Searching_result";
import { createAlgoliaClient } from "../firebase/algoliaConfig";


function Navbar() {
  const [clicked, setClicked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  //const [searchResults, setSearchResults] = useState([]);
  const [search_for, setSearch_for] = useState("posts");
  const [hits, setHits] = useState([]);

  const handleSearch = async () => {
    let index;

    if (search_for === 'posts') {
      index = createAlgoliaClient('posts');
    }
    if (search_for === 'users') {
      index = createAlgoliaClient('users');
    }

    try {
      if (!index) {
        throw new Error('Index not initialized');
      }

      const { hits } = await index.search(searchQuery); 
      console.log(hits);
      setHits(hits); 

    } catch (error) {
      console.error('Error searching with Algolia:', error);
      setHits([]);
    }
  };

  const handleClick = () => {
    setClicked(!clicked);
  };



  // we may need a filter to search because how algolia is implemented in firebase
  // the filter should only contain post or user
  // so need a design this
  
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
      <SearchResult results={hits} collection={search_for} />
    </nav>
  );
}

export { Navbar };