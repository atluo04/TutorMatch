# TutorMatch

### Contribution
    Allen Luo         - atluo04@ucla.edu           Github#: atluo04, AllenL0706    
        - Firebase, express, class forum, authentication, startup script, Github control
        
    Anne Hyunsun Joo  - annejoo0414@g.ucla.edu     Github#: AnneHyunsunJoo         
        - All HTML, CSS
        
    Effie Wu          - effiewu0628@g.ucla.edu     Github#: Parixxx21              
        - Firebase, router, chat, comments
        
    Jiwoo Jeong       - jiwoo315@ucla.edu          Github#: jiji123526             
        - All HTML, CSS
        
    Tzuhao Wang       - twang129@ucla.edu          Github#: baby-ww                
        - Firebase, Algolia, profile setting, searching


### Introduction
 **TutorMarch** is an academic exchange platform designed specifically for UCLA students, with the aim of providing a more centralized and flexible academic support for students on campus. 

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
From there, just run the start.py python file, and the project should be started up.
```
python start.py
```
If the Python file does not work, open up another terminal window and change your working directory to the backend and frontend folders, respectively, under /TutorMatch/tutormatch. From there, run npm install and npm start in both terminals, and the project should start.
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
