import { useState } from "react";
import { PasswordEmailInput } from "../components/PasswordEmailInput";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import "../html/UserRegistrationInfo.css";
import courseList from "../assets/courses.json";
import majorList from "../assets/majors.json";
import { useNavigate } from "react-router-dom";
import { ItemSelectionSearch } from "../components/ItemSelectionSearch";
import { useUser } from "../userContext";

function UserRegistrationInfo() {
  const { uid, setUid } = useUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [majors, setMajors] = useState(new Set());
  const [gender, setGender] = useState("Male");
  const [year, setYear] = useState("Freshman");
  const [courses, setCourses] = useState(new Set());
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/create-user-info`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: uid,
            Fullname: firstName + " " + lastName,
            Phone: phone,
            Majors: [...majors],
            Gender: gender,
            Year: year,
            Courses: [...courses],
          }),
        }
      );

      const data = await response.json();
      console.log(data);

      if (data.success) {
        navigate("/home");
      } else {
        setError("");
      }
    } catch (error) {
      alert("Server error!");
      console.log(error);
    }
  };

  return (
    <div className="userregistrationinfo-container">
      <div className="header">
        <div className="title">Get Started with TutorMatch</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <PasswordEmailInput
            placeHolderText={"First Name"}
            handleInput={setFirstName}
          />
        </div>
        <div className="input">
          <PasswordEmailInput
            placeHolderText={"Last Name"}
            handleInput={setLastName}
          />
        </div>
        <div className="phoneContainer">
          <PhoneInput
            placeholder={"Phone Number"}
            value={phone}
            onChange={setPhone}
            defaultCountry="US"
          />
        </div>
        <div className="genderContainer">
          <label>Select your gender:</label>
          <div className="select">
            <select value={gender} onChange={handleGenderChange}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-Binary</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className="yearContainer">
          <label>Select your current year: </label>
          <div className="select">
            <select value={year} onChange={handleYearChange}>
              <option value="freshman">Freshman</option>
              <option value="sophomore">Sophomore</option>
              <option value="junior">Junior</option>
              <option value="senior">Senior</option>
            </select>
          </div>
        </div>
        <div className="majorContainer">
          <label>Select your current major(s):</label>
          <ItemSelectionSearch
            updateItems={setMajors}
            itemList={majorList}
            maxItems={3}
            placeHolderText={"Search for majors..."}
          />
        </div>
        <div className="courseContainer">
          <label>Select your current courses:</label>
          <ItemSelectionSearch
            updateItems={setCourses}
            itemList={courseList}
            maxItems={5}
            placeHolderText={"Search for course IDs..."}
          />
        </div>
        <div className="submit-container">
          <div className="button" onClick={handleSubmit}>
            Submit
          </div>
        </div>
      </div>
    </div>
  );
}

export { UserRegistrationInfo };
