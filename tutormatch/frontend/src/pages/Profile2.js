import React, {useEffect, useState} from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card } from "../components/Card.js";
import { useUser } from '../userContext.js';
import PopUp from '../components/Popup.js';

export default function OthersProfile() {
    const [popUpOpen, setPopUpOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('userId');
    
    const handleClose = () => {
        setPopUpOpen(false);
        navigate('/otherprofile');

    }

    useEffect(() => {
        if (userId) {
            setPopUpOpen(true);
        }
    }, [userId]);

    return (
        <div style={{color: 'black'}}>
            <h1>This is a default header</h1>
          
          {popUpOpen && (
            <PopUp isOpen={popUpOpen} onClose={handleClose}>
              <Card userId={userId} onClose={handleClose} />
            </PopUp>
          )}
          <h1>This is a default end</h1>
        </div>
      );}