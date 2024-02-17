import './App.css';
import Home from './components/Home';
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div className="App">
      <Navbar />
      <Home/>
    </div>
  );
}