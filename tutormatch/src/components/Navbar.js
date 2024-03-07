import { MenuData } from "./MenuData";
import "./NavbarStyles.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { SearchResult } from "./Searching_result";
import { createAlgoliaClient } from "../firebase/algoliaConfig";

function Navbar() {
  const [clicked, setClicked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [search_for, setSearch_for] = useState("posts"); // Default search type
  const [hits, setHits] = useState([]);
  const [selectedTag, setSelectedTag] = useState(""); // State variable for selected tag

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

      let tagFilters = [];
      if (selectedTag) {
        tagFilters.push(selectedTag);
      }

      const { hits } = await index.search(searchQuery, { tagFilters }); // Include selected tag
      setHits(hits); 

    } catch (error) {
      console.error('Error searching with Algolia:', error);
      setHits([]);
    }
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
        <select onChange={(e) => setSelectedTag(e.target.value)} value={selectedTag}>
          <option value="">All Tags</option>
          <option value="tag1">Post</option>
          <option value="tag2">Users</option>
        </select>
        <button type="submit" onClick={handleSearch}>
          Search <i className="fas fa-search"></i>
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

