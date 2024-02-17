import '../html/style1.css'
import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { motion } from 'framer-motion'
import { auth } from "../firebase/firebaseConfig";
import {updata_profile, getdata, reset_user_data, deletel_user_database } from "../user/user_doc"


function ChangePassword() {
    return (
        <motion.div className="tab-pane active show" id="account-change-password"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }} 
          transition={{ duration: 0.5 }}>
          <div className="card-body pb-2">
              <div className="form-group">
                <label className="form-label">Current password</label>
                <input type="password" className="form-control" />
                    {/*dealwith the password change here*/}
              </div>
                <div className="form-group">
                  <label className="form-label">New password</label>
                  <input type="password" className="form-control" />
                    {/*dealwith the password change here, might need to change later to take advantage of react*/}
                    </div>
                <div className="form-group">
                  <label className="form-label">Confirm new password</label>
                  <input type="password" className="form-control" />
                    {/*dealwith the password change here*/}
                </div>
          </div>
        </motion.div>
      );
}

function Info() {
    return (
      <motion.div className="tab-pane active show" id="account-info"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.1 } }} 
        transition={{ duration: 0.5 }}>
        <div className="card-body pb-2">
          <div className="form-group">
            <label className="form-label">Bio</label>
              <textarea className="form-control" rows={5} style={{ resize: "none" }} defaultValue={"Hello, World!"}/>
          </div>
            <div className="form-group">
              <label className="form-label">Birthday</label>
                <input type="text"
                    className="form-control"
                    defaultValue="Jan 1, 1111"
                  />
            </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue="None"
                  />
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
              defaultValue="+0 (123) 456 7891"
                />
        </div>
          <div className="form-group">
            <label className="form-label">Personal E-mail</label>
            <input
              type="text"
              className="form-control"
              defaultValue="example@ucla.edu"
            />
          </div>
        </div>
      </motion.div>);
}

function Main() {
  //const [fullname, set_fullname] = useState("ii");
  const [major, set_major] = useState("Computer cience");
  const [fullname, setFullname] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const fullnameData = await getdata("Fullname");
          setFullname(fullnameData);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setIsLoading(false);
        }
      } else {
        console.log("No user is currently signed in.");
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const user = auth.currentUser;
  //       if (user) {
  //         const data = await getdata("Fullname");
  //         setFullname(data);
  //       } else {
  //         console.log("No user is currently signed in.");
  //       }
  //       setIsLoading(false); // Update loading state
  //     } catch (error) {
  //       console.error("Error fetching Fullname:", error);
  //       setIsLoading(false); // Update loading state even in case of error
  //     }
  //   };

  //   fetchData();
  // }, []);

  // useEffect(() => {
  //   fetchData("Fullname", setFullname);
  // }, []);

  // async function fetchData(field, setter) {
  //   try {
  //     const data = await getdata(field);
  //     setter(data);
      
  //   } catch (error) {
  //     console.error("Error getting " + field , error);
  //   }
  // }

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const data = await getdata("Fullname");
  //       setFullname(data);
  //     } catch (error) {
  //       console.error("Error fetching Fullname:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

    return(
        <motion.div className="tab-pane active show" id="account-main-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }} 
          transition={{ duration: 0.5 }}>
            {isLoading ? (
        <p>Loading...</p>
      ) : (
            <div className="card-body media align-items-center">
              <img
                src="https://mblogthumb-phinf.pstatic.net/20140512_191/thinkingbug_1399901578557l2bvg_PNG/%B0%CB%C1%A4.png?type=w420"
                alt=""
                className="d-block ui-w-80"/>
                <div className="media-body ml-4">
                  <label className="btn btn-outline-primary">
                    Upload new photo
                    <input type="file" className="account-settings-fileinput" />
                     </label>{" "}
                      &nbsp;
                      <button type="button" className="btn btn-default md-btn-flat">
                        Reset
                      </button>
                        <div className="text-light small mt-1">
                          Allowed JPG, GIF or PNG. Max size of 800K
                        </div>
                      </div>
                    </div>
      )}
                    <hr className="border-light m-0" />
                    <div className="card-body">
                    {!isLoading && (
          <>
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          className="form-control mb-1"
                          defaultValue={fullname}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Major</label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue={major}
                        />
                      </div>
                      </>
                    )}
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
          <div className="text-right mt-3">
            <button type="button" className="btn btn-primary">
              Save changes
            </button>
            &nbsp;
            <button type="button" className="btn btn-default">
              Cancel
            </button>
          </div>
        </div>
      </>);
    }
      
export { ProfileSettingPage, Main, Schedule, ChangePassword, Notification, Info };