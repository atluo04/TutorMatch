import React, {useState} from 'react';
import './App.css';
import Card from './Components/Card';

function App() {

  const [name, setName] = useState('Name');
  const [major, setMajor] = useState('Major');
  const [about, setAbout] = useState("But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects,");
  const [comment, setComment] = useState("Use this space.");

  return (
    <div className="App">
        <Card name={'Joe Bruin'} major={'Computer Science'} about={about} comment={comment}/>
    </div>
  );
}

export default App;
