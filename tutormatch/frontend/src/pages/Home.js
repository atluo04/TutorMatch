import "../html/HomeStyles.css";
import { Navbar } from "../components/Navbar";
import Home from "../html/home/Home.jsx"
import { useState, useEffect } from "react";
import PopUp from "../components/Popup";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "../components/Card.js";

function HomePage() {
  const [searchResults, setSearchResults] = useState([]);
  const [look_for, setLook_for] = useState("");
  const [popUpOpen, setPopUpOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('userId')

  const handleAvatarClick = (userId) => {
    if (userId) {
      navigate(`/home?userId=${userId}`);
      console.log(userId);
    } else {
      console.log(userId);
      navigate('/home');
    }
  };
  const handleClose = () => {
    setPopUpOpen(false);
    navigate('/home');
}
useEffect(() => {
  if (userId) {
      setPopUpOpen(true);
  }
}, [userId]);

  return (
    <>
      <div className="home-page">
        <Navbar setResults={setSearchResults} setLook_for={setLook_for}/>
        <div className="home">
          {searchResults.length === 0 && (
            <>
            <h1 className="welcome">Ask anything to your classmates!</h1>
            <br/>
            <div className="explanation-container">
            <p className="paragraph">Welcome to TutorMatch!<br></br><br></br>
            Connect with UCLA students for academic support.<br></br>
            Find tutors, share knowledge, and collaborate on coursework.<br></br>
            Use categorized posts for guidance and learning.<br></br>
            Use chat function for private communication and scheduling.<br></br>
            Join TutorMatch to enhance your learning journey and contribute to UCLA's academic community.</p>
            </div>
            </>
          )}
          <Home searchResults={searchResults} look_for={look_for} onAvatarClick={handleAvatarClick}/>
        </div>
      </div>
      <br/>
      {popUpOpen && (
            <PopUp isOpen={popUpOpen} onClose={handleClose}>
              <Card userId={userId} onClose={handleClose} />
            </PopUp>
          )}
    </>
  );
}

export { HomePage };
