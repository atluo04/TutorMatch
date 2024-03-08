import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useUser } from "../userContext";

function ProfilePage({user}) {
  const { uid, setUid } = useUser();
  const [comments, setComments] = useState([]);
  const [displayedUser, setDisplayerUser] = useState(user || uid);    //pass in user you are viewing    
  const [newComment, setNewComment] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [error, setError] = useState("");

  const getComments = async() =>{
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/get-comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: displayedUser,               //need to change to user we are currently visiting
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setComments(data.value);
      } else {
        setError("Error fetching comments.");
      }
    } catch (error) {
      alert("Server error!");
      console.log(error);
    }
  }

  const handleInput = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/add-comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: displayedUser, //replace with target uid
            content: newComment,
            fromUid: uid,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setNewComment("");
      } else {
        setError("Error submitting comment.");
      }
    } catch (error) {
      alert("Server error!");
      console.log(error);
    }
    getComments();
  };

  const handleDelete = async (commentId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/delete-comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: displayedUser,
            commentId: commentId,
            fromUid: uid, //replace with actual uid
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setComments(comments.filter((comment) => commentId !== commentId));
      } else {
        setError("Error with deleting comment.");
      }
    } catch (error) {
      alert("Server error!");
      console.log(error);
    }
  };

  const handleLikes = async (commentId) => {
    if (!isDisabled) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/like-comment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uid: displayedUser,                     //change to be target user uid
              commentId: commentId,
              fromUid: uid
            }),
          }
        );

        const data = await response.json();

        if (data.success) {
            console.log(`Liked comment: ${commentId}`);
        } else {
          setError("Error liking comment.");
        }
      } catch (error) {
        alert("Server error!");
        console.log(error);
      }
      
      getComments();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (displayedUser) {
        getComments();
      }
    };
    fetchData();
  }, [displayedUser]);

  return (
    <div>
      <h1>{displayedUser} Profile Page</h1>
      <div>
        <h2>Comments Sorted by Likes:</h2>
        {comments.length > 0 ? (
          <ul>
            {comments.map((comment) => (
              <li key={comment.id}>
                {comment.content} - Likes: {comment.likes}
                <button onClick={() => handleLikes(comment.id)}>Like</button>
                <button onClick={() => handleDelete(comment.id)}>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments found.</p>
        )}
        <form onSubmit={handleInput}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="New comment"
          />
          <button type="submit">Submit Comment </button>
        </form>
      </div>

      <Link to="/profile-setting/main">Go to Profile Settings: </Link>
      <Link to="/otherprofile/IFPBzeNj7fXQnKvyb9fVk2yPivq1">Go to test other page</Link>

    </div>
  );
}
export { ProfilePage };
