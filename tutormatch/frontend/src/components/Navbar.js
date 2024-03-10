import { MenuData } from "./MenuData";
import "./NavbarStyles.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../userContext.js";
import { useNavigate } from "react-router-dom";

function Navbar({ setResults, setLook_for }) {
  const { uid, setUid } = useUser();
  const [clicked, setClicked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [search_for, setSearch_for] = useState("posts");
  const [hits, setHits] = useState([]);
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/home?query=${search_for}&searchQuery=${searchQuery}`
      );

      setSearchQuery("");
      if (!response.ok) {
        throw new Error("Failed to fetch post database");
      }

      const data = await response.json();
      if (data.success) {
        // if(data.hits.length === 0)
        //   console.log(data.hits);
        // else
        // console.log("yes")
        setHits(data.hits);
        setResults(data.hits);
        setLook_for(search_for);
      } else {
        throw new Error("Failed to fetch user info");
      }
    } catch (error) {
      alert("Server error!");
      console.log(error);
    }
  };

  const getCourses = async (uid) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/get-courses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: uid
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setCourses(data.value);
      } else {
        throw new Error("Failed to fetch user courses.");
      }
    } catch (error) {
      alert("Server error!");
      console.log(error);
    }
  };

  useEffect(() => {
    getCourses(uid); // Fetch user courses when the component mounts
  }, [uid]);

  const handleClick = () => {
    setClicked(!clicked);
    
  };

  const HandleLogout = () => {
    const authToken = localStorage.getItem("authToken");
    localStorage.removeItem("token");

    if (!authToken) {
      console.log("User is logged out");
    } else {
      console.log("User is logged in");
    }
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
        <select
          onChange={(e) => setSearch_for(e.target.value)}
          value={search_for}
        >
          <option value="" disabled hidden>
            All Tags
          </option>
          <option value="posts">Post</option>
          <option value="users">Users</option>
        </select>
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
              {item.dropdown ? (
                <>
                  <div className="nav-dropdown">
                    <Link
                      className={item.cName}
                    >
                      <i className={item.icon}></i>
                      {item.title}
                    </Link>
                    <ul className="dropdown-menu">
                      {courses.map((course, courseIndex) => (
                        <li key={courseIndex}>
                          <button
                            className="dropdown-link"
                            onClick={() => navigate(`/forum/${course}`)}
                          >
                            {course}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <Link
                  to={item.url}
                  className={item.cName}
                  onClick={item.logout ? HandleLogout : null}
                >
                  <i className={item.icon}></i>
                  {item.title}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
      {/* <SearchResult results={hits} collection={search_for} /> */}
    </nav>
  );
}

export { Navbar };
