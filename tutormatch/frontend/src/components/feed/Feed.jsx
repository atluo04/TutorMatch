import React from "react";
import "./feedhome.css";
import Post_home from "../post/Post_home.jsx"
import "../../html/HomeStyles.css"

const Feed = ({searchResults, look_for, onAvatarClick}) => {
        
    return (
        <div className="feedhome">
            <div className="feedhomeWrapper">
            {searchResults.map((result, index) => (
                <Post_home post={result} key={index} look_for={look_for}
                onAvatarClick = {onAvatarClick} />
            ))}
            </div>
        </div>
    )
}

export default Feed