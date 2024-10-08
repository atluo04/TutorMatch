### Introduction
 **TutorMatch** is an academic exchange platform designed specifically for UCLA students, with the aim of providing a more centralized and flexible academic support for students on campus. 

### Features
TutorMatch offers a range of features to facilitate academic communication and support:

- **One-on-One Chat**: A platform for direct communication between students and teaching assistants (TAs), as well as among students themselves. This feature enables private conversations, facilitating direct communication and assistance. 

- **Courses Forum**: Dedicated spaces for each class where students can seek help or contribute answers. These forums promote interaction within the academic community.

- **Search Functionality**: Users can quickly search for relevant information based on subject interests, user profiles, and post content. This enhances the efficiency of accessing academic resources.

- **Personal Profile**: This section allows others to view essential information about a person, including the courses they are currently enrolled in and tags indicating areas in which the person can offer support.


### Components
Our app adopts a client-server architcture:
- **Backend**:
    - **Firebase**: 
        - Offers backend support for the project, including but not limited to:
            - Authentication: Facilitates user authentication processes.
            - Cloud Firestore: Storing and synchronizing global application data (Data base).
            - Firebase storage: Storing the files and pictures securely.

    - **Express**: 
        - Host the backend server, enabling routing control and the construction of RESTful APIs. It uses HTTP methods, such as GET and POST, to facilitate communication with the frontend.
    - **Algolia**:
        - Enhances our search feature by providing advanced search algorithms for optimized results.

- **Frontend**:
    - **React**: 
        - Utilize React's components and hooks to meet the interaction and real-time update needs in different parts of the application.
     
    - **CSS**:
        - It is used for designing the styles for the whole project, covering aspects like colors, fonts, margins.


### Setup/Installation
##### Requirements:
- Node.js
- Python3

First, clone the repository into a directory of your choosing.
```
cd \CHOSEN\PATH
git clone https://github.com/atluo04/TutorMatch
```
After cloning the repository, change your working directory to the repo.
```
cd \PATH\TO\CLONED\REPO\TutorMatch
```
From there, just run the start.py python file, and the project should be started up. To stop the process, enter in Control-C (or any other keyboard interrupt key).
```
python start.py
```
If the Python file does not work, open up another terminal window and change your working directory to the backend and frontend folders, respectively, under /TutorMatch/tutormatch. From there, run npm install and npm start in both terminals, and the project should start.
In the backend folder, also create a .env file with the following contents:
```
FIREBASE_API_KEY="[FILL IN FIREBASE API KEY]"
FIREBASE_AUTH_DOMAIN="tutormatch-789d9.firebaseapp.com"
FIREBASE_PROJECT_ID="tutormatch-789d9"
FIREBASE_STORAGE_BUCKET="tutormatch-789d9.appspot.com"
FIREBASE_MESSAGING_SENDER_ID="956855862545"
FIREBASE_APP_ID="1:956855862545:web:e5f1b79a82ce1c45c138b0"
FIREBASE_MEASUREMENT_ID="G-V25ZNBDNCD"

ALGOLIA_APP_ID="R7E5FEZGEQ"
ALGOLIA_POST_API_KEY="[FILL IN ALGOLIA POST API KEY]"
ALGOLIA_USER_API_KEY="[FILL IN ALGOLIA USER API KEY]"

```
```
cd \PATH\TO\CLONED\REPO\TutorMatch\tutormatch\backend
npm install
npm start
```
```
cd \PATH\TO\CLONED\REPO\TutorMatch\tutormatch\frontend
npm install
npm start
```


### References
- https://firebase.google.com/docs
- https://expressjs.com/
- https://reactrouter.com/en/main
- https://nodejs.org/docs/latest/api/
- https://www.youtube.com/watch?v=CgMD6VykQXQ
- https://www.algolia.com/doc/
