import './App.css';
import NewUserDetails from './Components/NewUserDetails';
import RegisterForm from './Components/RegisterForm';
import { Routes, Route } from "react-router-dom";



function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<RegisterForm/>} />
        <Route path="*" element={<RegisterForm/>} />
        <Route path="/NewUserDetails" element={<NewUserDetails/>} />
      </Routes>
    </>

  );
}

export default App;
