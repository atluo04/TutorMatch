import './Card.css';
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect} from "react";
import { useUser } from '../userContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';



function Card({userId, onClose}) {
    const [name, setName] = useState('Name');
    const [major, setMajor] = useState([]);
    const [about, setAbout] = useState("ok");
    const [comments, setComments] = useState([]);
    const [image, setImage] = useState("https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg")
    const [newComment, setNewComment] = useState("");
    const [email, setEmail] = useState("");
    const [course, setCourse] = useState([]);
    const [phone, setPhone] = useState("");
    const [year, setYear] = useState("");
    const [tags, setTags] = useState("");
    const [Gender, setGender] = useState("");
    const { uid, setUid } = useUser();
    const [error, setError] = useState(null);
    let navigate = useNavigate();


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
              console.log(data.value.Fullname )
                setName(data.value.Fullname || 'Unknown');
                setMajor(data.value.Majors || []);
                setAbout(data.value.Bio || 'No bio provided');
                setImage(data.value.profile_pic || "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg");
                setEmail(data.value.Personal_mail || 'Unknown');
                setPhone(data.value.Phone || 'Unknown');
                setYear(data.value.Year || 'Unknown');
                setTags(data.value.Tags || []);
                setGender(data.value.Gender || 'Unknown');
                setCourse(data.value.Courses || []);
              }
            else {
            setError("Error fetching userInfo.");
            }
        }
    catch(error) {
        console.log("Error fetching userInfo.")

    }
      }
    async function getComments(userId){
        try {
          const response = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/get-comments`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                uid: userId,             
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
                uid: userId,
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
          try {
            const response = await fetch(
              `${process.env.REACT_APP_SERVER_URL}/like-comment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  uid: userId,   
                  commentId: commentId,
                  fromUid: uid
                }),
              }
            );
    
            const data = await response.json();
    
            if (data.success) {
                console.log(`Liked comment: ${commentId}`);
            } else {
                console.log("error")
            }
          } catch (error) {
            alert("Server error!");
            console.log(error);
          }
          getComments(userId);
      };
    
      const handleInput = async (e) => {
        e.preventDefault();
        console.log("Entered handleInput")
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
                uid: userId, 
                content: newComment,
                fromUid: uid,
              }),
            }
          );
    
          const data = await response.json();
    
          if (data.success) {
            console.log(data.message);
            setNewComment("");
            getComments(userId);

          } else {
            console.log("Error setting comments");
          }
        } catch (error) {
          alert("Server error!");
          console.log(error);
        }
      };

      async function handleNewChat(user, target) {
        try {
        if (user !== target && user && target) {
          const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/create-new-chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user,
              targetId: target,
            }),
          });
          const data = await response.json();
          if (response.ok && data.value && data.success) {
            navigate('/chat', { state: { activeId: data.value.id } });
          } else {
            alert(data.message);

          }
        }
        else {alert("Cannot create a chat with youself or Please log in")}
        } catch (error) {
          console.error('Error creating chat:', error);
        }
      }

      useEffect(() => {
        if(userId) {
            setUserInfo(userId);
            getComments(userId)}
      }, [userId]);

      return (
        <div className='Card'>
            <div className='upper-container'>
                <div className='image-container'>
                    <img src={image} alt='' height='100px' width='100px' />
                </div>
            </div>
            <div className='user-info-container'>
                <h2> {name} </h2>
                <h4> Major: {Array.isArray(major) ? major.join(', ') : major} </h4>
                <p> {about} </p>
            </div>
            <div className='contact-info-container'>
                <p>Email: {email}</p>
                <p>Phone: {phone}</p>
            </div>
            <div className='personal-info-container'>
                <p>Year: {year}</p>
                <p>Gender: {Gender}</p>
                {/* <p>Birth Date: {birth}</p> */}
            </div>
            <div className='tags-courses-container'>
                <p>Tags: {Array.isArray(tags) ? tags.join(', ') : tags}</p>
                <p>Courses: {Array.isArray(course) ? course.join(', ') : course}</p>
            </div>
            <div className='comments-container'>
              {Array.isArray(comments)&& comments.length > 0 ? (
              <ul className='comment-text'>
                {comments.map((comment) => (
                  <li key={comment.id}>
                  {comment.content} <FontAwesomeIcon icon={faThumbsUp} className="like-icon"/> {comment.likes}
                <button onClick={() => handleLikes(comment.id)}>Like</button>
                {/*<button onClick={() => handleDelete(comment.id)}>Delete</button>*/}
                </li>
              ))}
            </ul>
          ) : (
            <p>No comments found.</p>
          )}
            </div>
            <div className='interaction-container'>
                <button onClick={() => handleNewChat(uid, userId)}>Send a message</button>
                <form onSubmit={handleInput}>
                    <input
                        type="text"
                        className="input-comment"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="New comment"
                    />
                    <button type="submit">Submit Comment</button>
                </form>
            </div>
        </div>
    );
      }

export {Card};