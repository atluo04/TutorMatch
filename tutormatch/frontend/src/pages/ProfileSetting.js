import '../html/style1.css'
import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { motion } from 'framer-motion'
import { useUser } from "../userContext";


function Main() {
  const {uid, setUid} = useUser();
  const [fullname, setfullname] = useState("");
  const [newname, setNewname] = useState("");
  //const [major, setMajor] = useState("");
  const [newmajor, setNewmajor] = useState([]);
  const [pic_url, setPic_url] = useState("");
  const [picUrl, setPicUrl] = useState(null); // State to store the URL of the selected image
  const [photo, setPhoto] = useState(null);
  const [year, setYear] = useState("");
  const [newyear, setNewyear] = useState("");
  //const [course, setCourse] = useState(new Set());
  const [newcourese, setNewcourse] = useState([]);
  const [tags, setTags] = useState([]); 
  const [error, setError] = useState(null);  
  //error stores the message of succeed or fail, it can be used as for the pop message
  
  const get_user_info = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/profile-setting/main?uid=${uid}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }
      const data = await response.json();
      if (data.success) {
        //console.log(data.Fullname);
        setfullname(data.Fullname);
        setNewname(data.Fullname);
        setNewmajor(data.Majors);
        setPic_url(data.Pic);
        //setPhoto(data.Pic);
        setPicUrl(data.Pic);
        setYear(data.Year);
        setNewyear(data.Year);
        setNewcourse(data.Courses);
        setTags(data.Tags);
      } else {
        throw new Error('Failed to fetch user info');
      }
    } catch (error) {
      alert("Server error!");
      console.log(error);
    }
  };
  useEffect(() => {
    get_user_info();
    
  }, []);


  

  const handleSave = async () => {
    if(newname !== fullname || newyear !== year || picUrl !== pic_url){
      try {
        const formData = new FormData();
        formData.append('uid', uid);
        formData.append('Fullname', newname);
        formData.append('Year', newyear);
        formData.append('Pic', photo);
        console.log(formData);
        const response = await fetch(
              `${process.env.REACT_APP_SERVER_URL}/profile-setting/main`,
              {
                  method: "POST",
                  body: formData,
              }
          );
        
          if (response.ok) {
            // Handle successful update
            console.log("Profile updated successfully");
          } else {
            // Handle failed update
            console.error("Failed to update profile");
          }

          setfullname(newname);
          setPic_url(picUrl);
          setYear(year);
      } catch (error) {
          alert("Server error!");
          console.log(error);
      }
    }
  }

  const handleSavepic = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("a");
      setPhoto(file);
      if(photo !== null)
      {
        console.log("shit", photo.size)
      }
      setPicUrl(URL.createObjectURL(file));
      console.log("a");
      e.target.value = null;
      
    }
  };


  const handleCancel = async () => {
    setNewname(fullname);
    setPhoto(null);
    setPicUrl(pic_url);
    setError(null);
    setNewyear(year)
  };

  if (newmajor === null || newcourese === null || picUrl === null || tags === null) {
    return <div>Loading...</div>; // Render loading indicator
  }
    return(
        <motion.div className="tab-pane active show" id="account-main-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }} 
          transition={{ duration: 0.5 }}>
            <div className="card-body media align-items-center">
              <img
                src={picUrl}
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
                        <div 
                          className="form-control" 
                          style={{ backgroundColor: 'white', height: 'auto', whiteSpace: 'pre-line' }} // Set height to auto and white-space to pre-line
                        >
                          {newmajor.length === 0 ? "-" :newmajor.map((major) => `• ${major}\n`)}
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Year</label>
                          <select
                            className="form-control"
                            value={newyear}
                            onChange={(e) => setNewyear(e.target.value)}
                          >
                            <option value="none" disabled hidden>Gender</option>
                            <option value="freshman">Freshman</option>
                            <option value="sophomore">Sophomore</option>
                            <option value="junior">Junior</option>
                            <option value="senior">Senior</option>
                          </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">I am good at</label>
                        <div 
                          className="form-control" 
                          style={{ backgroundColor: 'white', height: 'auto', whiteSpace: 'pre-line' }} // Set height to auto and white-space to pre-line
                        >
                          {tags.length === 0 ? "-" : tags.map((tag) => `• ${tag}\n`)}
                        </div>
                      </div>
                    <div className="form-group">
                        <label className="form-label">Courses I'm taking</label>
                        <div 
                          className="form-control" 
                          style={{ backgroundColor: 'white', height: 'auto', whiteSpace: 'pre-line' }} // Set height to auto and white-space to pre-line
                        >
                          {newcourese.length === 0 ? "-" : newcourese.map((courses) => `• ${courses}\n`)}
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

function Info() {
  const {uid, setUid} = useUser();
  const [bio, setbio] = useState("")
  const [newbio, setNewbio] = useState("");
  const [birth, setbirth] = useState("") 
  const [newbirth, setNewbirth] = useState("");
  const [gender, setgender] = useState("");
  const [newgender, setNewgender] = useState("");
  const [phone, setphone] = useState("");
  const [newphone, setNewphone] = useState("");
  //const [email, setemail] = useState("");
  const [newemail, setNewemail] = useState("");
  const [error, setError] = useState(null);

  const get_user_info = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/profile-setting/info?uid=${uid}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }
      const data = await response.json();
      if (data.success) {
        setbio(data.Bio);
        setgender(data.Gender);
        setphone(data.Phone);
        setNewbio(data.Bio);
        setNewgender(data.Gender);
        setNewphone(data.Phone);
        setNewemail(data.Email);
        setbirth(formatDate(data.Birth));
        setNewbirth(formatDate(data.Birth));
        //console.log("aa", raw_date)
      } else {
        throw new Error('Failed to fetch user info');
      }
    } catch (error) {
      alert("Server error!");
      console.log(error);
    }
  };
  useEffect(() => {
    get_user_info();
    
  }, []);
 
  
  const handleSave = async () => {

    if(newbio !== bio || newbirth != birth || newgender !== gender || newphone !== phone){
      
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/profile-setting/info`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uid: uid,
              Bio: newbio,
              Birth: newbirth,
              Gender: newgender,
              Phone: newphone,
            }),
          }
        );
  
        const data = await response.json();
        //console.log(data);
  
        if (data.success) {
          console.log("suc");
          setbirth(newbirth);
          setbio(newbio);
          setgender(newgender);
          setphone(newphone);
        } else {
          console.log("fail");
        }
      } catch (error) {
        alert("Server error!");
        console.log(error);
      }
    }
  }

  async function handleCancel() {
    await Promise.all([
      setNewbio(bio),
      setNewbirth(birth),
      setNewgender(gender),
      setNewphone(phone),
      
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
                  <option value="non-binary">Non-Binary</option>
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
              //onChange={(e) => setNewemail(e.target.value)}
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
  
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/profile-setting/password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword: currentPS, 
            newPassword: newPS,
          }),
        }
      );

      const data = await response.json();
      console.log(data);

      if (data.success) {
        console.log("suc");
        } else {
          console.log("fail");
      }
    } catch (error) {
      alert("Server error!");
      console.log(error);
    }

    handleCancel();
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
                    to="/profile-setting/main"
                    className="list-group-item list-group-item-action"
                    activeclassname = "list-group-item list-group-item-action active"> Main Page </NavLink>
                <NavLink
                    to="/profile-setting/info"
                    className="list-group-item list-group-item-action"
                    activeclassname = "list-group-item list-group-item-action active"> info </NavLink>
                <NavLink
                    to="/profile-setting/password"
                    className="list-group-item list-group-item-action"
                    activeclassname = "list-group-item list-group-item-action active"> Change Passward </NavLink>
                <NavLink
                    to="/profile-setting/schedule"
                    className="list-group-item list-group-item-action"
                    activeclassname = "list-group-item list-group-item-action active"> Schedule </NavLink>
                <NavLink
                    to="/profile-setting/notification"
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


    // function Get_user_data(field){
    //   //const [isLoading, setIsLoading] = useState(true); 
    //   // Add loading state
    //   const [userData, setUserData] = useState(null);
    //   console.log("getting", field)
    //   useEffect(() => {
    //     const unsubscribe = auth.onAuthStateChanged(async (user) => {
    //       if (user) {
    //         try {
    //           const userData = await getdata(field);
    //           setUserData(userData);
    //           //setIsLoading(false);
    //         } catch (error) {
    //           console.error("Error fetching data:", error);
    //           //setIsLoading(false);
    //         }
    //       } else {
    //         console.log("No user is currently signed in.");
    //         //setIsLoading(false);
    //       }
    //     });
    
    //     return unsubscribe;
    //   }, []);
    //   return userData;
    // }

    function formatDate(timestamp) {
      const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
      const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
      return `${year}-${month}-${day}`;
  }
    function get_time(birth_ugly) {
      try {
        if (birth_ugly !== null) {
          console.log(birth_ugly);
          const birthDate = new Date(birth_ugly * 1000);
          const formattedBirthDate = birthDate.toISOString().split('T')[0];
          //console.log(formattedDate);
          return formattedBirthDate;
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
      
export { ProfileSettingPage, Main, Info, ChangePassword, Schedule, Notification };