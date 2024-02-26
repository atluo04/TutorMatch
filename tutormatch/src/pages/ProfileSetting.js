import '../html/style1.css'
import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { motion } from 'framer-motion'
import { auth } from "../firebase/firebaseConfig";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { db } from "../firebase/firebaseConfig";
import { collection, updateDoc, setDoc, getDoc, doc } from 'firebase/firestore';
import {updata_profile, getdata, upload_profile_pic, reset_user_data, deletel_user_database } from "../user/user_doc"


function Main() {
  const fullname = Get_user_data("Fullname");
  const [newname, setNewname] = useState("");
  const major = Get_user_data("Major");
  const [newmajor, setNewmajor] = useState("");
  const pic_url = Get_user_data("profile_pic")
  const [picUrl, setPicUrl] = useState(""); // State to store the URL of the selected image
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState(null);  
  //error stores the message of succeed or fail, it can be used as for the pop message

  useEffect(() => {
    setNewname(fullname);
    setNewmajor(major);
    setPhoto(pic_url);
    setPicUrl("");
  }, [fullname, major, pic_url]);

  const handleSave = async () => {
    if(newname !== fullname){
      try {
        await updata_profile("Fullname", newname);
        setError('Updated full name')
      } catch (error) {
        setError("Error updating full name")
        console.error("Error updating data:", error);
      }
    }
    if(newmajor !== major){
      try {
        await updata_profile("Major", newmajor);
        setError('Updated major')
      } catch (error) {
        setError("Error updating major")
        console.error("Error updating data:", error);
      }
    }
    if(photo !== pic_url){
      try {
        await upload_profile_pic(photo);
        //await updata_profile("profile_pic", photo);
        setError('Updated pic')
      } catch (error) {
        setError("Error updating pic")
        console.error("Error updating data:", error);
      }
    }
    
  };

  const handleSavepic = (e) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
      setPicUrl(URL.createObjectURL(e.target.files[0]));
    }
  };


  const handleCancel = async () => {
    setNewname(fullname);
    setNewmajor(major);
    setPhoto(null);
    setPicUrl("")
    setError(null);
  };

  
    return(
        <motion.div className="tab-pane active show" id="account-main-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }} 
          transition={{ duration: 0.5 }}>
            <div className="card-body media align-items-center">
              <img
                src={picUrl || pic_url}
                alt=""
                className="d-block ui-w-80"/>
                <div className="media-body ml-4">
                  <label className="btn btn-outline-primary">
                    Upload new photo
                    <input type="file" className="account-settings-fileinput" onChange={handleSavepic}/>
                     </label>{" "}
                      &nbsp;
                        <div className="text-light small mt-1">
                          Allowed JPG, GIF or PNG. Max size of 800K
                        </div>
                      </div>
                    </div>
                    <hr className="border-light m-0" />
                    <div className="card-body">
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          className="form-control mb-1"
                          value={newname}
                          onChange={(e) => setNewname(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Major</label>
                        <input
                          type="text"
                          className="form-control"
                          value={newmajor}
                          onChange={(e) => setNewmajor(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="text-right mt-3">
                      <button type="button" className="btn btn-primary" onClick={handleSave}>
                      Save changes
                      </button>
                      &nbsp;
                      <button type="button" className="btn btn-default" onClick={handleCancel}>
                      Cancel
                      </button>
                    </div>
        </motion.div>
    );

}

function ChangePassword() {
  const [currentPS, setCurrentPS] = useState('');
  const [newPS, setNewPS] = useState('');
  const [confirmPS, setconfirmPS] = useState('');
  const [error, setError] = useState(null);  
  //error stores the message of succeed or fail, it can be used as for the pop message


  async function handleSave() {

    const passwordMessage = validatePassword(newPS, confirmPS);
      if (passwordMessage !== null) {
        setError(passwordMessage);
        console.log(passwordMessage);
        await handleCancel();
        return;
      }

    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, currentPS);
    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPS);
      setError('Password updated successfully')
      console.log('Password updated successfully');
      handleCancel();
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
          setError('Failed to access the account');
          console.log('Failed to access the account');
        }
      else{
          setError('Failed to update password:', error.message);
          console.log('Failed to update password:', error.message);
        }
      handleCancel();
    }  

  }
  

  async function handleCancel() {
    await Promise.all([
      setCurrentPS(''),
      setNewPS(''),
      setconfirmPS(''),
      setError(null)
    ]);
  }


    return (
        <motion.div className="tab-pane active show" id="account-change-password"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }} 
          transition={{ duration: 0.5 }}>
          <div className="card-body pb-2">
              <div className="form-group">
                <label className="form-label">Current password</label>
                <input type="password" 
                       className="form-control" 
                       value = {currentPS}
                       onChange={e => setCurrentPS(e.target.value)}/>
                    {/*dealwith the password change here*/}
              </div>
                <div className="form-group">
                  <label className="form-label">New password</label>
                  <input type="password" 
                         className="form-control"
                         value = {newPS} 
                         onChange={e => setNewPS(e.target.value)}/>
                    {/*dealwith the password change here, might need to change later to take advantage of react*/}
                    </div>
                <div className="form-group">
                  <label className="form-label">Confirm new password</label>
                  <input type="password" 
                          className="form-control" 
                          value = {confirmPS}
                          onChange={e => setconfirmPS(e.target.value)}/>
                    {/*dealwith the password change here*/}
                </div>
          </div>
          <div className="text-right mt-3">
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              Save changes
            </button>
            &nbsp;
            <button type="button" className="btn btn-default" onClick={() => handleCancel()}>
              Cancel
            </button>
          </div>
        </motion.div>
      );
}

function Info() {
  const bio = Get_user_data("Bio");
  const [newbio, setNewbio] = useState(bio);
  const birth = get_time("Birthday");
  const [newbirth, setNewbirth] = useState(birth);
  const gender = Get_user_data("Sex");
  const [newgender, setNewgender] = useState(gender);
  const phone = Get_user_data("Phone");
  const [newphone, setNewphone] = useState(phone);
  const email = Get_user_data("Personal_mail");
  const [newemail, setNewemail] = useState(email);
  const [error, setError] = useState(null);

  useEffect(() => {
      setNewbio(bio);
      setNewbirth(birth);
      setNewgender(gender);
      setNewphone(phone);
      setNewemail(email);
  }, [bio, birth, gender, phone, email]);
  
  const handleSave = async () => {
    if(newbio !== bio){
      try {
        await updata_profile("Bio", newbio);
      } catch (error) {
        console.error("Error updating data:", error);
      }
    }
    if(newbirth !== birth){
      try {
        const dateParts = newbirth.split('-');
        const selectedDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        await updata_profile("Birthday", selectedDate);
      } catch (error) {
        console.error("Error updating data:", error);
      }
    }
    if(newgender !== gender){
      try {
        await updata_profile("Sex", newgender);
      } catch (error) {
        console.error("Error updating data:", error);
      }
    }
    if(newphone !== phone){
      try {
        await updata_profile("Phone", newphone);
      } catch (error) {
        console.error("Error updating data:", error);
      }
    }
    if(newemail !== email){
      try {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(newemail)) {
          setError("Invalid Email");
          console.log("Invalid Email");
          return;
        }
        await updata_profile("Personal_mail", newemail);
      } catch (error) {
        console.error("Error updating data:", error);
      }
    }
    
  };

  async function handleCancel() {
    await Promise.all([
      setNewbio(bio),
      setNewbirth(birth),
      setNewgender(gender),
      setNewphone(phone),
      setNewemail(email),
      
    ]);
  }
  if (bio == null) {
    return <div>Loading...</div>; // Render loading indicator
  }
    return (
      <motion.div className="tab-pane active show" id="account-info"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.1 } }} 
        transition={{ duration: 0.5 }}>
        <div className="card-body pb-2">
          <div className="form-group">
            <label className="form-label">Bio</label>
              <textarea className="form-control" rows={5} style={{ resize: "none" }} value={newbio}  
                onChange={(e) => setNewbio(e.target.value)}/>
          </div>
            <div className="form-group">
              <label className="form-label">Birthday</label>
                <input type="date"
                    className="form-control"
                    value={newbirth}
                    onChange={(e) => setNewbirth(e.target.value)}
                  />
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
                <select
                  className="form-control"
                  value={newgender}
                  onChange={(e) => setNewgender(e.target.value)}
                >
                  <option value="none" disabled hidden>Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <hr className="border-light m-0" />
              <div className="card-body pb-2">
                <h6 className="mb-4">Contacts</h6>
                <div className="form-group">
                  <label className="form-label">Phone</label>
            <input
              type="text"
              className="form-control"
              value={newphone}
              onChange={(e) => setNewphone(e.target.value)}
                />
        </div>
          <div className="form-group">
            <label className="form-label">Personal E-mail</label>
            <input
              type="text"
              className="form-control"
              value={newemail}
              onChange={(e) => setNewemail(e.target.value)}
            />
          </div>
        </div>
        <div className="text-right mt-3">
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              Save changes
            </button>
            &nbsp;
            <button type="button" className="btn btn-default" onClick={() => handleCancel()}>
              Cancel
            </button>
          </div>
      </motion.div>);
}



function Schedule() {
    return (
    <motion.div className="tab-pane active show" id="account-schedule"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }} 
      transition={{ duration: 0.5 }}>
      <div className="card-body pb-2">
        <h4 className="mb-4">Schedule</h4>
          <table>
            <thead bgcolor="#E0E0E0">
              <tr>
                <th>Time</th>
                <th>Sunday</th>
                <th>Monday</th>
                <th>Tuesday</th>
                <th>Wednesday</th>
                <th>Thursday</th>
                <th>Friday</th>
                <th>Saturday</th>
            </tr>
                </thead>
                  <tbody>
                    <tr>
                      <td>8:00am</td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                    </tr>
                    <tr>
                        <td>10:00am</td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                    </tr>
                    <tr>
                        <td>12:00pm</td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                    </tr>
                    <tr>
                        <td>2:00pm</td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                    </tr>
                    <tr>
                        <td>4:00pm</td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                    </tr>
                    <tr>
                        <td>6:00pm</td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                    </tr>
                    <tr>
                        <td>8:00pm</td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                    </tr>
                    <tr>
                        <td>10:00pm</td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                    </tr>
                    <tr>
                        <td>12:00am</td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                        <td>{" "}<textarea className="schedule" rows={3} cols={11} style={{ resize: "none" }} defaultValue={" "} /> {" "} </td>
                    </tr>
                  </tbody>
                </table>
            </div>
            <div className="text-right mt-3">
            <button type="button" className="btn btn-primary">
              Save changes
            </button>
            &nbsp;
            <button type="button" className="btn btn-default">
              Cancel
            </button>
          </div>
          </motion.div>);

}

function Notification() {
    return (
    <motion.div className="tab-pane active show" id="account-notifications"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }} 
      transition={{ duration: 0.5 }}>
    <div className="card-body pb-2">
      <h6 className="mb-4">Activity</h6>
      <div className="form-group">
        <label className="switcher">
          <input
            type="checkbox"
            className="switcher-input"
            defaultChecked=""
          />
          <span className="switcher-indicator">
            <span className="switcher-yes" />
            <span className="switcher-no" />
          </span>
          <span className="switcher-label">
            Email me when someone comments on my post
          </span>
        </label>
      </div>
      <div className="form-group">
        <label className="switcher">
          <input type="checkbox" className="switcher-input" />
          <span className="switcher-indicator">
            <span className="switcher-yes" />
            <span className="switcher-no" />
          </span>
          <span className="switcher-label">
            Email me when someone sends me a message
          </span>
        </label>
        
      </div>
    </div>
    <div className="text-right mt-3">
      <button type="button" className="btn btn-primary">
        Save changes
      </button>
      &nbsp;
        <button type="button" className="btn btn-default">
          Cancel
        </button>
    </div>
  </motion.div>);
}

function ProfileSettingPage () {

    return(
        <>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preload" href="../html/style1.css" as="style"/>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.0/dist/css/bootstrap.min.css"
          rel="preload" as="style"
        />
        <title>User Profile Setting Page</title>
        <link rel="stylesheet" href="../html/style1.css" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <div className="container light-style flex-grow-1 container-p-y">
          <h4 className="font-weight-bold py-3 mb-4">Profile settings</h4>
          <div className="card overflow-hidden">
            <div className="row no-gutters row-bordered row-border-light">
              <div className="col-md-3 pt-0">
                <div className="list-group list-group-flush account-settings-links">
         
                <nav>
                <NavLink
                    to="/settings/main"
                    className="list-group-item list-group-item-action"
                    activeclassname = "list-group-item list-group-item-action active"> Main Page </NavLink>
                <NavLink
                    to="/settings/password"
                    className="list-group-item list-group-item-action"
                    activeclassname = "list-group-item list-group-item-action active"> Change Password </NavLink>
                <NavLink
                    to="/settings/info"
                    className="list-group-item list-group-item-action"
                    activeclassname = "list-group-item list-group-item-action active"> Info </NavLink>
                <NavLink
                    to="/settings/schedule"
                    className="list-group-item list-group-item-action"
                    activeclassname = "list-group-item list-group-item-action active"> Schedule </NavLink>
                <NavLink
                    to="/settings/notification"
                    className="list-group-item list-group-item-action"
                    activeclassname = "list-group-item list-group-item-action active"> Notification </NavLink>
                    </nav>
                </div>
              </div> 
              <div className="col-md-9">
                <div className="tab-content">
                <Outlet />
                </div>
              </div>
            </div>
          </div>

        </div>
      </>);
    }


    function Get_user_data(field){
      //const [isLoading, setIsLoading] = useState(true); 
      // Add loading state
      const [userData, setUserData] = useState(null);

      useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
          if (user) {
            try {
              const userData = await getdata(field);
              setUserData(userData);
              //setIsLoading(false);
            } catch (error) {
              console.error("Error fetching data:", error);
              //setIsLoading(false);
            }
          } else {
            console.log("No user is currently signed in.");
            //setIsLoading(false);
          }
        });
    
        return unsubscribe;
      }, []);
      return userData;
    }

    function get_time(field) {
      try {
        const userData = Get_user_data(field);
        if (userData !== null) {
          const birth = userData.toDate();
          const ConvertDate = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(birth);
          const parts = ConvertDate.split("/");
          const formattedDate = `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
          //console.log(formattedDate);
          return formattedDate;
      }} catch (error) {
        console.error("Error retrieving data:", error);
        return null;
      }
    }

    const validatePassword = (password, confirmPassword) => {
// comment out below to enable password restriction
      // const correctLength = /^.{8,16}$/;
      // if (!correctLength.test(password)) {
      //   return "Password must be between 8 and 16 characters long.";
      // }
      // const noWhiteSpace = /^S*$/;
      // if (noWhiteSpace.test(password)) {
      //   return "Password must not contain whitespace.";
      // }
      // const containsUppercase = /^(?=.*[A-Z]).*$/;
      // if (!containsUppercase.test(password)) {
      //   return "Password must contain at least 1 uppercase letter.";
      // }
      // const containsLowercase = /^(?=.*[a-z]).*$/;
      // if (!containsLowercase.test(password)) {
      //   return "Password must contain at least 1 lowercase letter.";
      // }
      // const containsSpecialChar = /^(?=.*[,.!@#$%^&*~:;'\"()-+=~`_\[\]\\/?|]).*$/;
      // if (!containsSpecialChar.test(password)) {
      //   return "Password must contain at least 1 special character.";
      // }
      if (password != confirmPassword) {
        return "Passwords do not match.";
      }
      return null;
    };
      
export { ProfileSettingPage, Main, Schedule, ChangePassword, Notification, Info, Get_user_data };