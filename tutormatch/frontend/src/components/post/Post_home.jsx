import React, {useState} from "react";
import "./post_home.css";


const Post = ({post, look_for, onAvatarClick}) => {
    return (
        <>
            {look_for === 'posts' && (
                <div className="post">
                    <div className="postWrapper">
                        <div className="postTop">
                            <div className="postTopLeft">
                                <img className="postProfileImg" src={post.profile_pic} alt="" onClick={() => onAvatarClick(post.objectID)}/>
                                <span className="postUsername">{post.Fullname}</span>
                                <span className="postDate">{format_time(post.date, look_for)}</span>
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
                            <img className="postProfileImg" src={post.profile_pic} alt=""  onClick={() => onAvatarClick(post.objectID)}/>
                            <span className="postUsername"  onClick={() => onAvatarClick(post.objectID)}>{post.Fullname}</span>
                            {/* <span className="postDate">{format_time(post.Birthday, look_for)}</span> */}
                        </div>
                        <div className="postTopRight">
                            <span className="postText">{post.Year}</span>
                        </div>
                    </div>
                    <div className="postCenter">
                        <div className="postTopLeft">Majors:</div>
                            <div className="postMajorsTags">
                                {post.Majors ? (
                                    post.Majors.map((major, index) => (
                                        <span key={index} className="postMajorTag">{major}</span>
                                    ))
                                ) : (
                                    <span className="postMajorTag">No majors listed</span>
                                )}
                            </div>
                        <div className="postTopLeft">Ask me about:</div>
                            <div className="postMajorsTags">
                            {post.Tags ? (
                                post.Tags.map((tag, index) => (
                                <   span key={index} className="postTag">{tag}</span>
                                ))
                            ) : (
                                <span className="postTag">No tags available</span>
                            )}
                            </div>
                        <div className="postTopLeft">Bio:</div>
                            <span className="postText">{post.Bio}</span>
                    </div>
                    <div className="postBottom">
                        <div className="postBottomLeft"></div>
                            <span className="postCreateDate">Member since: {format_time(post.created_date, look_for)}</span>
                    </div>
                </div>
            </div>
            )}
        </>
    );
};

function format_time(timestamp, look_for) {

    const utcDate = new Date(timestamp);

    const targetDate = new Date(utcDate.getTime() - (8 * 60 * 60 * 1000));

    const year = targetDate.getUTCFullYear();
    const month = ('0' + (targetDate.getUTCMonth() + 1)).slice(-2);
    const day = ('0' + targetDate.getUTCDate()).slice(-2);
    const hours = ('0' + targetDate.getUTCHours()).slice(-2);
    const minutes = ('0' + targetDate.getUTCMinutes()).slice(-2);
    const seconds = ('0' + targetDate.getUTCSeconds()).slice(-2);

    let formattedDate;
    if (look_for === "users")
        formattedDate = `${year}-${month}-${day}`;
    else
    formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedDate;
}



export default Post