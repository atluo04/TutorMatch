import React from "react";
import "./sidebar.css";
import {Chat, Person, Notifications} from "@material-ui/icons";
import {Link} from "react-router-dom";

const Sidebar = () => {
    return (
        <div className="sidebar">

            <div className="sidebarWrapper">

                    <ul className="sidebarList">

                          <li className="sidebarPersonContainer">
                            <img className="sidebarPerson" src="assets/person/mert.jpg" alt="" />
                            <Link to="/mertkaan" className="sidebarPersonName">Mert Kaan</Link>
                          </li>

                          <li className="sidebarListItem">
                            <Person className="sidebarIcon"/>
                            <span className="sidebarListItemText">Profile</span>
                          </li>

                          <li className="sidebarListItem">
                            <Chat className="sidebarIcon"/>
                            <span className="sidebarListItemText">Messages</span>
                          </li>

                          <li className="sidebarListItem">
                            <Notifications className="sidebarIcon"/>
                            <span className="sidebarListItemText">Notifications</span>
                          </li>
                    </ul>

                    <button className="sidebarButton">Sign Out</button>

                    <hr className="sidebarHr"></hr>

            </div>

        </div>
    )
}

export default Sidebar