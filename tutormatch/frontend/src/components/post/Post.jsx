import React, {useState} from "react";
import "./post.css";


const Post = ({post, look_for}) => {
    return (
        <>
            {look_for === 'posts' && (
                <div className="post">
                    <div className="postWrapper">
                        <div className="postTop">
                            <div className="postTopLeft">
                                <img className="postProfileImg" src={post.profile_pic} alt="" />
                                <span className="postUsername">{post.Fullname}</span>
                                <span className="postDate">{format_time(post.date)}</span>
                            </div>
                            <div className="postTopRight">
                                {/* Any content for postTopRight */}
                            </div>
                        </div>
                        <div className="postCenter">
                            <span className="postText">{post.content}</span>
                            <img className="postImg" src="" alt="" />
                        </div>
                        <div className="postBottom">
                            <div className="postBottomLeft">
                                {/* Any content for postBottomLeft */}
                            </div>
                            <div className="postBottomRight">
                                <span className="postCommentText">{post.comment} comments</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {look_for === 'users' && (
                <div className="post">
                <div className="postWrapper">
                    <div className="postTop">
                        <div className="postTopLeft">
                            <img className="postProfileImg" src={post.profile_pic} alt="" />
                            <span className="postUsername">{post.Fullname}</span>
                            <span className="postDate">{format_time(post.Birthday)}</span>
                        </div>
                        <div className="postTopRight">
                            {/* Any content for postTopRight */}
                        </div>
                    </div>
                    <div className="postCenter">
                        <span className="postText">{post.Tags}</span>
                        <span className="postText">{post.Bio}</span>
                    </div>
                    <div className="postBottom">
                        <div className="postBottomLeft">
                            {/* Any content for postBottomLeft */}
                        </div>
                        <div className="postBottomRight">
                            <span className="postCommentText">{post.comment} comments</span>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </>
    );
};

function format_time(timestamp) {

    const date = new Date(timestamp * 1000);
  
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
  
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  
    return formattedDate;
  }

export default Post