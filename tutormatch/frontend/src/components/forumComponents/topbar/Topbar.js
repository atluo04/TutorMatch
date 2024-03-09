import React from "react";
import "./topbar.css"
import SearchIcon from "@mui/icons-material/Search";
import {Link} from "react-router-dom";

const Topbar = ({course}) => {
  return (
    <div className="topbarContainer">

       <div className="topbarLeft">
        <Link to="/home" className="logo">TutorMatch</Link>
       </div>
       <span className="courseName">{course}</span>

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