import React, { useState } from "react";
import Card from "./Components/Card";
import './ProfilePopup.css'
import { getdata } from "../user/user_doc";

function ProfilePreview() {
  const [name, setName] = useState(getdata("Fullname")); // need to update with the user id for the profile
  const [major, setMajor] = useState(getdata("Majors")); // need to update with the user id for the profile
  const [about, setAbout] = useState(getdata("Bio")); // need to update with the user id for the profile
  const [comment, setComment] = useState("Use this space.");

  return (
    <div className="profilePreview">
      <Card
        name={"Joe Bruin"}
        major={"Computer Science"}
        about={about}
        comment={comment}
      />
    </div>
  );
}

export {ProfilePreview};
