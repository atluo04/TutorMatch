import { AppRouter } from './routes/AppRouter';
import { auth, db } from "./firebase/firebaseConfig.js";
import { getFirestore, collection, getDocs } from "firebase/firestore";


function App() {
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App;
