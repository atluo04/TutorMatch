import React from "react";
import "./sidebar.css";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";

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
                            <PersonIcon className="sidebarIcon"/>
                            <span className="sidebarListItemText">Profile</span>
                          </li>

                          <li className="sidebarListItem">
                            <ChatIcon className="sidebarIcon"/>
                            <span className="sidebarListItemText">Messages</span>
                          </li>

                          <li className="sidebarListItem">
                            <NotificationsIcon className="sidebarIcon"/>
                            <span className="sidebarListItemText">Notifications</span>
                          </li>
                    </ul>


                    <hr className="sidebarHr"></hr>

            </div>

        </div>
    )
}

export default Sidebar