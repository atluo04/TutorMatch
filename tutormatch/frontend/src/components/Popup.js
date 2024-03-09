import React from 'react';
import './PopUp.css'; 

function PopUp({ isOpen, onClose, children }) {
    if (!isOpen) {
        return null;
    } 

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <br/>
                <button style={{marginTop: '60px'}} onClick={onClose}>Close</button>
                {children}
            </div>
        </div>
    );
}

export default PopUp;