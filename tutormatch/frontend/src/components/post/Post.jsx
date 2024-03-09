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

    const utcDate = new Date(timestamp);

    const targetDate = new Date(utcDate.getTime() - (8 * 60 * 60 * 1000));

    const year = targetDate.getUTCFullYear();
    const month = ('0' + (targetDate.getUTCMonth() + 1)).slice(-2);
    const day = ('0' + targetDate.getUTCDate()).slice(-2);
    const hours = ('0' + targetDate.getUTCHours()).slice(-2);
    const minutes = ('0' + targetDate.getUTCMinutes()).slice(-2);
    const seconds = ('0' + targetDate.getUTCSeconds()).slice(-2);

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedDate;
}



export default Post