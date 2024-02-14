import { collection, getDocs } from "firebase/firestore"; 
import { app, db, auth } from "../firebase/firebaseConfig"

function ProfilePage () {
    const user = auth.currentUser
    if (user) {
        console.log(user.email)
    }
    return (
        <div>
          <h1>Profile Page</h1>
          <form>
            <label>Email: {user.email}</label>
          </form>
        </div>
      );
    }

export {ProfilePage}