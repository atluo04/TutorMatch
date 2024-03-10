import React, {useState} from "react";
import "./post_home.css";


const Post_home = ({post, look_for, onAvatarClick}) => {
    return (
        <>
            {look_for === 'posts' && (
                <div className="post_h">
                    <div className="postWrapper_h">
                        <div className="postTop_h">
                            <div className="postTopLeft_h">
                                <img className="postProfileImg_h" src={post.profile_pic} alt="" onClick={() => onAvatarClick(post.objectID)}/>
                                <span className="postUsername_h">{post.Fullname}</span>
                                <span className="postDate_h">{format_time(post.date, look_for)}</span>
                            </div>
                            <div className="postTopRight_h">
                                {/* Any content for postTopRight */}
                            </div>
                        </div>
                        <div className="postCenter_h">
                            <span className="postText_h">{post.content}</span>
                            <img className="postImg_h" src="" alt="" />
                        </div>
                        <div className="postBottom_h">
                            <div className="postBottomLeft_h">
                                {/* Any content for postBottomLeft */}
                            </div>
                            <div className="postBottomRight_h">
                                <span className="postCommentText_h">{post.comment} comments</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {look_for === 'users' && (
                <div className="post_h">
                <div className="postWrapper_h">
                    <div className="postTop_h">
                        <div className="postTopLeft_h">
                            <img className="postProfileImg_h" src={post.profile_pic} alt=""  onClick={() => onAvatarClick(post.objectID)}/>
                            <span className="postUsername_h"  onClick={() => onAvatarClick(post.objectID)}>{post.Fullname}</span>
                            {/* <span className="postDate">{format_time(post.Birthday, look_for)}</span> */}
                        </div>
                        <div className="postTopRight_h">
                            <span className="postText_h">{post.Year}</span>
                        </div>
                    </div>
                    <div className="postCenter_h">
                        <div className="postTopLeft_h">Majors:</div>
                            <div className="postMajorsTags_h">
                                {post.Majors ? (
                                    post.Majors.map((major, index) => (
                                        <span key={index} className="postMajorTag_h">{major}</span>
                                    ))
                                ) : (
                                    <span className="postMajorTag_h">No majors listed</span>
                                )}
                            </div>
                        <div className="postTopLeft_h">Ask me about:</div>
                            <div className="postMajorsTags_h">
                            {post.Tags ? (
                                post.Tags.map((tag, index) => (
                                <   span key={index} className="postTag_h">{tag}</span>
                                ))
                            ) : (
                                <span className="postTag_h">No tags available</span>
                            )}
                            </div>
                        <div className="postTopLeft_h">Bio:</div>
                            <span className="postText_h">{post.Bio}</span>
                    </div>
                    <div className="postBottom_h">
                        <div className="postBottomLeft_h"></div>
                            <span className="postCreateDate_h">Member since: {format_time(post.created_date, look_for)}</span>
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



export default Post_home