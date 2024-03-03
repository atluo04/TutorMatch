import React from "react";
import "./topbar.css"
import { Search } from "@material-ui/icons"
import {Link} from "react-router-dom";

const Topbar = () => {
  return (
    <div className="topbarContainer">

       <div className="topbarLeft">

       <Link to="/" className="logo">Tutor Match</Link>
       </div>

       <div className="topbarCenter">
         <div className="searchbar">
           <Search className="searchIcon" />
           <form><input placeholder="Search" className="searchInput"></input></form>
         </div>
       </div>

    </div>
  )
};

export default Topbar