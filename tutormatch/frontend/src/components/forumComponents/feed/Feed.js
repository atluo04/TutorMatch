import React from "react";
import "./feed.css";
import Share from "../../share/Share.js";
import Post from "../../post/Post.js"

const Posts = [     //temporary data
  {
    id: 1,
    userId: 1,
    desc: `version 1.0.0 beta 💫`,
    photo: "",
    date: "5 mins ago",
    like: 9,
    comment: 0,
  },
  {
    id: 2,
    userId: 2,
    desc: "i suppose i love him",
    photo: "assets/post/moriarty.jpeg",
    date: "15 mins ago",
    like: 2,
    comment: 1,
  },
  {
    id: 3,
    userId: 3,
    desc: "yea it's me",
    photo: "assets/post/patrick.jpg",
    date: "1 hour ago",
    like: 61,
    comment: 2,
  },
  {
    id: 4,
    userId: 4,
    desc: "",
    photo: "assets/post/tyler.jpg",
    date: "3 hours ago",
    like: 7,
    comment: 3,
  },
  {
    id: 5,
    userId: 5,
    desc: "",
    photo: "assets/post/kayzer.jpg",
    date: "6 hours ago",
    like: 23,
    comment: 5,
  },
];

const Feed = () => {
    return (
        <div className="feed">
            <div className="feedWrapper">

             <Share />
             {Posts.map((p)=> (
                 <Post post={p} key={p.id}/>
                
             ))}

            </div>
        </div>
    )
}

export default Feed