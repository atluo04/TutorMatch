import React, { useEffect, useState } from "react";
import "./post.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useForum } from "../forumComponents/forumContext";
import DOMPurify from 'dompurify';
import { useUser } from "../../userContext";


const Post = () => {
  const { selectedPost } = useForum();
  const [post, setPost] = useState([]);
  const [poster, setPoster] = useState("");
  const [comment, setComment] = useState("");
  const { uid, setUid } = useUser();
  const [comments, setComments] = useState([]);
  const [userInfos, setUserInfos] = useState({});

  const getPost = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/get-post-by-id`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId: selectedPost,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setPost(data.value);
        await getUser(data.value.poster);
      } else {
        throw new Error("Error getting post information.");
      }
    } catch (error) {
      alert("Server error!");
      console.log(error);
    }
  };

  const getUser = async (userId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/get-user-info`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: userId,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setPoster(data.value.name);
      } else {
        throw new Error("Error getting poster user information.");
      }
    } catch (error) {
      alert("Server error!");
      console.log(error);
    }
  };

  useEffect(() => {
    getPost();
    getComments();
  }, [selectedPost]);

  const sanitizeHTML = (html) => {
    if(html){
      const cleanedHtmlContent = html.replace(/^"(.*)"$/, "$1");
      return DOMPurify.sanitize(cleanedHtmlContent);
    }
  };

  const processImageUrl = (url) => {
    if(url){
      return url.replace(/^"(.*)"$/, "$1");
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault(); 
    if (selectedPost && comment.trim() !== ""&&uid) {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/add-post-comment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    target: selectedPost,
                    fromUser: uid,
                    commentContent: comment, 
                }),
            });
            const data = await response.json();
            if (data.success) {
                setComment(""); 
                getComments();
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            alert("Server error!");
            console.log(error);
        }
    } else {
        alert("Please enter a comment.");
    }
};

  const getComments = async() =>{
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


  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postInformation">
          <h2>{post.title}</h2>
          <div className="posterInformation">
            By: {poster} at {post.date}
          </div>
        </div>
        <div className="postContent">
          <div
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.content) }}
          />
          {post.image && (
            <div className="postImage">
              <img src={processImageUrl(post.image)} alt={"Post Image"} />
            </div>
          )}
        </div>
        <div className="commentWrapper">
          <h4>Comments</h4>
          <textarea
            placeholder="Add a new comment"
            className="commentInput"
            onChange={(e) => {
              setComment(e.target.value);
            }}
            value={comment}
          ></textarea>
          <div className="commentSubmitButton" onClick={handleCommentSubmit}>
            Submit
          </div>
        </div>
        <div className="commentsContainer">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="comment">
                {comment.userInfo ? (
                  <div className="commenterInfo">
                    <img src={comment.userInfo.image} alt="Commenter" />
                    By: {comment.userInfo.name}
                    <div className="commentContent">{comment.content}</div>
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
  );
};

export default Post;
