import { HomePage } from "./pages/Home.js";
import { auth, db } from "./firebase/firebaseConfig.js";
import { getFirestore, collection, getDocs } from "firebase/firestore";

function App() {
  return (
    <div className="App">
      <HomePage />
    </div>
  );
}

export default App;
