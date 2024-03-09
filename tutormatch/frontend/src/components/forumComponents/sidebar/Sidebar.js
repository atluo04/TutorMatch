import React, { useState, useEffect } from "react";
import "./sidebar.css";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";
import { Link } from "react-router-dom";
import { useUser } from "../../../userContext";
import { useForum } from "../forumContext";

const Sidebar = ({ course }) => {
  const { uid, setUid } = useUser();
  const { showCreatePost, setShowCreatePost, setSelectedPost } = useForum();

  const [posts, setPosts] = useState([]);
  const [userName, setUserName] = useState("");

  const getPosts = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/get-posts-by-course`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            course: course,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setPosts(data.value);
      } else {
        throw new Error("Error loading posts");
      }
    } catch (error) {
      alert("Server error!");
      console.log(error);
    }
  };

  const getUserInfo = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/get-user-info`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: uid,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        console.log(data);
        setUserName(data.value.name);
      } else {
        throw new Error("Error getting user information.");
      }
    } catch (error) {
      alert("Server error!");
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts();
    getUserInfo();
  }, [course]);

  useEffect(() => {
    getPosts();
    getUserInfo();
  },[showCreatePost]);

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarPersonContainer">
            <img
              className="sidebarPerson"
              src="assets/person/mert.jpg" //edit to get profile image from database
              alt=""
            />
            <span className="sidebarPersonName">{userName}</span>
          </li>
          <div className="postsHeader">
            <span className="recentPosts">Recent Posts</span>
            <span className="newPost" onClick={() => setShowCreatePost(true)}>
              + New
            </span>
          </div>
          <hr className="postsHeaderLine"></hr>
          <div className="postList">
            {posts.map((post) => (
              <li key={post.id} className="sidebarListItem">
                <div>
                  <h4 className="postTitle">{post.title}</h4>
                  <p className="postDate">{post.date}</p>
                  {/* Render other post data as needed */}
                </div>
              </li>
            ))}
          </div>
        </ul>

        <hr className="sidebarHr"></hr>
      </div>
    </div>
  );
};

export default Sidebar;
