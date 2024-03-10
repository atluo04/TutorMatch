import React, { useEffect, useState } from "react";
import "./post.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useForum } from "../forumComponents/forumContext";
import DOMPurify from 'dompurify';

const Post = () => {
  const { selectedPost } = useForum();
  const [post, setPost] = useState([]);
  const [poster, setPoster] = useState("");
  const [comment, setComment] = useState("");

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

  const handleCommentSubmit = async () => {
    /*
    BACKEND STUFF FOR SUBMITTING COMMENTS 
    */
  }

  const getComments = async() =>{
    try {
      //ROUTE STUFF FOR GETTING COMMENTS
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
          <input placeholder="Add a new comment" className="commentInput" onChange={(e) => {setComment(e.target.value)}}></input>
          <div className="commentSubmitButton" onClick={handleCommentSubmit}>Submit</div>
        </div>
      </div>
    </div>
  );
};

export default Post;
