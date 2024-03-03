import React from "react";
import "./share.css";
import {PermMedia, Label, Room, EmojiEmotions} from "@material-ui/icons"

const Share = () => {
    return (
        <div className="share">

          <div className="shareWrapper">

              <div className="shareTop">
                <img className="shareProfileImg" src="/assets/person/mert.jpg" alt=""/>               
                <input className="shareInput" placeholder="Write a post" />
              </div>
              <hr className="shareHr"/>

              <div className="shareBottom">

                  <div className="shareOptions">

                     <div className="shareOption">
                        <PermMedia htmlColor="tomato" className="shareIcon"/>
                        <span className="shareOptionText">Photo or Video</span>
                     </div>

                     <div className="shareOption">
                        <Label htmlcolor="blue" className="shareIcon"/>
                        <span className="shareOptionText">Tag</span>
                     </div>

                     <div className="shareOption">
                        <Room htmlColor="green" className="shareIcon"/>
                        <span className="shareOptionText">Location</span>
                     </div>

                     <div className="shareOption">
                        <EmojiEmotions htmlColor="goldenrod" className="shareIcon"/>
                        <span className="shareOptionText">Emotions</span>
                     </div>

                  </div>
                  
                    <button className="shareButton">Post</button>
                    
              </div>
        
          </div>

        </div>
    )
}

export default Share;