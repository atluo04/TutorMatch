import React, {useState, useEffect} from "react";
import DOMPurify from 'dompurify';
import "./post_home.css";
import { useNavigate } from "react-router-dom";


const Post_home = ({post, look_for, onAvatarClick}) => {
    const [user_data, setData] = useState(null);
    const [comments, setComments] = useState([]);
    const navigate = useNavigate();

    async function setUserInfo(userId) {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/get-user-info2`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user: userId })
                },
            );
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data.success) {
                //console.log(post.date )
                setData(data.value)}
            else {
                throw new Error("Error fetching userInfo.");
            }
        }
    catch(error) {
        console.log("Error fetching userInfo.")

        }
    }
    
    


    const sanitizeHTML = (html) => {
        if(html){
          const cleanedHtmlContent = html.replace(/^"(.*)"$/, "$1");
          return DOMPurify.sanitize(cleanedHtmlContent);
        }
    };



    async function getComments(selectedPost){
        try {
          //ROUTE STUFF FOR GETTING COMMENTS
          const response = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/get-post-comments`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                target: selectedPost, 
              }),
            }
          );
      
          const data = await response.json();
      
          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch comments.");
          }
      
          if (data.success && data.value) {
            let userInfo = {};
            const commentsWithInfo = await Promise.all(
              data.value.map(async(comment) => {
                console.log(comment.from, 'ad')
                if (!userInfo[comment.from]) {
                  const userResponse = await fetch(`${process.env.REACT_APP_SERVER_URL}/get-user-info`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ user: comment.from }),
                  });
                const userData = await userResponse.json();
                if (userData.success) {
                  userInfo[comment.from] = userData.value; 
                } else {
                  console.error("Error getting information");
                }
              }
              return {
                ...comment,
                userInfo: userInfo[comment.from]
              };
            }));
            setComments(commentsWithInfo);
          } else {
            throw new Error(data.message || "Failed to fetch comments.");
          }
    
        } catch (error) {
          alert("Server error!");
          console.log(error);
        }
      }

      useEffect(() => {
        console.log(post.userId)
        if(post.userId && post.objectID) {
            setUserInfo(post.userId);}
            getComments(post.objectID)
      }, [post.userId, post.objectID]);

    return (
        <>
            {look_for === 'posts' && user_data && (
                <div className="post_h">
                    <div className="postWrapper_h">
                        <div className="postTop_h">
                            <div className="postTopLeft_h">
                                <img className="postProfileImg_h" src={user_data.profile_pic} alt="" onClick={() => onAvatarClick(post.userId)}/>
                                <span className="postUsername_h" onClick={() => onAvatarClick(post.userId)}>{user_data.Fullname}</span>
                                <span className="postDate_h">{format_time_for_post(post.date)}</span>
                            </div>
                            <div className="postTopRight_h">
                                <span className="postText_h" style={{ cursor: 'pointer' }} onClick={() => navigate(`/forum/${post.course}`)}>{post.course}</span>
                            </div>
                        </div>
                        <div className="postCenter_h">
                        <div dangerouslySetInnerHTML={{__html: sanitizeHTML(post.title)}}
                                className="postTitle_h"
                            ></div>
                            <div dangerouslySetInnerHTML={{__html: sanitizeHTML(post.content)}}
                                className="contentContainer"
                            ></div>
                            <img className="postImg_h" src={post.image} alt="" />
                        </div>
                        <div className="postBottom_h">
                            <div className="postBottomLeft_h">
                                {/* Any content for postBottomLeft */}
                            </div>
                            <div className="commentsContainer_h">
                                {comments.length > 0 ? (
                                    comments.map((comment) => (
                                        <div key={comment.id} className="comment_h">
                                            {comment.userInfo ? (
                                                <div className="commenterInfo_h">
                                                    <img src={comment.userInfo.image} alt="Commenter" onClick={() => onAvatarClick(comment.from)} />
                                                    <span onClick={() => onAvatarClick(comment.from)} style={{ cursor: 'pointer' }}>
                                                        {comment.userInfo.name}:
                                                    </span>
                                                    <div className="commentContent_h">{comment.content}</div>
                                                </div>
                                            ) : (
                                                <span>Loading commenter info...</span>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="noComments">No comments yet.</div>
                                )}
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
                            <span className="postCreateDate_h">Member since: {format_time_for_post(post.created_date)}</span>
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

function format_time_for_post(timestamp) {
    // Create a new Date object from the Unix timestamp (in milliseconds)
    const date = new Date(timestamp * 1000); // JavaScript uses milliseconds, so multiply by 1000

    // Use toUTCString to convert the date to a UTC string
    const adjustedDate = new Date(date.getTime() + -8 * 3600 * 1000);

    // Build a custom formatted string
    const customFormat = adjustedDate.getUTCFullYear() + '-' +
        ('0' + (adjustedDate.getUTCMonth() + 1)).slice(-2) + '-' + // Months are 0-indexed
        ('0' + adjustedDate.getUTCDate()).slice(-2) + ' ' +
        ('0' + adjustedDate.getUTCHours()).slice(-2) + ':' +
        ('0' + adjustedDate.getUTCMinutes()).slice(-2) + ':' +
        ('0' + adjustedDate.getUTCSeconds()).slice(-2) ;

    return customFormat; // or return utcString for the standard UTC format
}


export default Post_home