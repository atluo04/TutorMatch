import React from "react";
import "./topbar.css"
import SearchIcon from "@mui/icons-material/Search";
import {Link} from "react-router-dom";

const Topbar = () => {
  return (
    <div className="topbarContainer">

       <div className="topbarLeft">

       <Link to="/" className="logo">Tutor Match</Link>
       </div>

       <div className="topbarCenter">
         <div className="searchbar">
           <SearchIcon className="searchIcon" />
           <form><input placeholder="Search" className="searchInput"></input></form>
         </div>
       </div>

    </div>
  )
};

export default Topbar