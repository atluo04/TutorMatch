import { collection, getDocs } from "firebase/firestore"; 
import { app, db, auth } from "../firebase/firebaseConfig"
import { Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { addNewComment, increaseLike, getCommentsByLikes, deleteComments, deleteComment } from "../user/comments"


function ProfilePage () {
  const user = auth.currentUser;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("")
  const [isDisabled, setIsDisabled] = useState(false);

  const handleInput = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
  try {
    await addNewComment(user.uid, newComment, user.uid);
    setNewComment("");
    const fetchedComments = await getCommentsByLikes(user.uid);
    setComments(fetchedComments);
  }
  catch(error) {
    console.error(error.message);
    }
  }

  const handleDelete = async (commentId) => {
    try {
      console.log(await deleteComment(user.uid, commentId, user.uid));
      const updatedComments = comments.filter(comment => comment.id !== commentId);
      setComments(updatedComments)

    }
    catch(error) {
      console.error(error.message);
      }
  }

  const handleLikes = async (commentId) => {
    if (!isDisabled){
      try {
        //will be modified, the first user.id should be the user we are current visiting
        await increaseLike(user.uid, commentId, user.uid);
        //will be modified, user.id should be the user we are current visiting
        const fetchedComments = await getCommentsByLikes(user.uid);
        setComments(fetchedComments);
        setTimeout(() => {
          setIsDisabled(false);
        }, 1000);

      } catch(error) {
        console.error(error.message);
      }
    }
  }
  

  useEffect(() => {
      const fetchData = async () => {
          if (user) {
              try {
                //will be modified, user.id should be the user we are current visiting
                  const fetchedComments = await getCommentsByLikes(user.uid);
                  setComments(fetchedComments);
              } catch (error) {
                  console.error(error);
              }
          }
      };
      fetchData();
  }, [user]);

    return (
      <div>
        <h1>Profile Page</h1>
        <div>
          <h2>Comments Sorted by Likes:</h2>
          {comments.length > 0 ? (
            <ul>
              {comments.map(comment => (
                <li key={comment.id}>{comment.content} - Likes: {comment.likes}
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
        <Link to="/settings/main">Go to Profile Settings: </Link>
        <Link to="/chat">Go to Chat page</Link>
      </div>
    );
  }
export {ProfilePage}