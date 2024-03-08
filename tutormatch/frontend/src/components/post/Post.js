import React, {useState} from "react";
import "./post.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Users = [ //temporary data
  {
    id: 1,
    profilePicture: "assets/person/mert.jpg",
    username: "Mert Kaan",
  },
  {
    id: 2,
    profilePicture: "assets/person/moriarty.jpg",
    username: "James Moriarty",
  },
  {
    id: 3,
    profilePicture: "assets/person/patrick.jpg",
    username: "Patrick Bateman",
  },
  {
    id: 4,
    profilePicture: "assets/person/tyler.jpg",
    username: "Tyler Durden",
  },
  {
    id: 5,
    profilePicture: "assets/person/kayzer.jpg",
    username: "Kayzer Söze",
  },
];

const Post = ({post}) => {
    const [like, setLike] = useState(post.like);
    const [isLiked, setIsLiked] = useState(false);

    const likeHandler = () => {
        setLike(isLiked ? like-1 : like+1)
        setIsLiked(!isLiked)
    };

    return (
         <div className="post">

              <div className="postWrapper">
                 
                    <div className="postTop">

                          <div className="postTopLeft">
                                <img className="postProfileImg" src={Users.filter((u) => u.id === post?.userId)[0].profilePicture} alt=""/>
                                <span className="postUsername">{Users.filter((u) => u.id === post?.userId)[0].username}</span>
                                <span className="postDate">{post.date}</span>
                          </div>

                          <div className="postTopRight">
                                <MoreVertIcon/>
                          </div>

                    </div>

                    <div className="postCenter">
                         <span className="postText">{post?.desc}</span>
                         <img className="postImg" src={post.photo} alt="" />
                    </div>

                    <div className="postBottom">

                        <div className="postBottomLeft">
                            <img className="likeIcon" src="/assets/like.png" onClick={likeHandler} alt=""/>
                            <img className="likeIcon" src="/assets/heart.png" onClick={likeHandler} alt=""/>
                            <span className="postLikeCounter">{like} people liked this</span>
                        </div>

                        <div className="postBottomRight">
                            <span className="postCommentText">{post.comment} comments</span>
                        </div>

                    </div>

              </div>

         </div>
    )

};

export default Post