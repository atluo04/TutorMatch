import React from "react";
import "./feed.css";
import Post from "../post/Post.jsx"
import { useState } from "react";


const Feed = ({searchResults, look_for}) => {
        
    return (
        <div className="feed">
            <div className="feedWrapper">
            {searchResults.map((result, index) => (
                <Post post={result} key={index} look_for={look_for} />
            ))}
            </div>
        </div>
    )
}

export default Feed