import React, { useState } from 'react'
import '../../html/Login.css'

import user_icon from '../Login/Assets/person.png'
import password_icon from '../Login/Assets/password.png'

const LoginSignup = () => {
    const [id, setId] = useState("")
    const [password, setPassword] = useState("")

    return (
        <div className='container'>
            <div className="header">
                <div className="text">Login</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <div className="input">
                    <img src={user_icon} alt="" />
                    <input type="text" placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} />
                </div>
                <div className="input">
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
            </div>
            <div className="forgot-password">Lost Password? <span>Click Here!</span></div>
            <div className="submit-container">
                <div className="submit" onClick={() => console.log("Login clicked")}>Login</div>
            </div>
        </div>
    )
}

export default LoginSignup

