import React from 'react';
import Lyric from './lyric.js';
import Comment from './comment.js';

let Song = React.createClass({
  render() {
    console.log("Song render");
    console.log(this.props.song);
    return(
        <div className="song-container">
          <div className="background blur" style={{backgroundImage: "url("+this.props.song.album.blurPicUrl+")"}}></div>
          <div className="toggle" onClick={this.props.toggleSong} style={{width: "100px", height: "50px"}}>toggle</div>
          <div className="content">
            <div className="top">
              <div className="song-cover">
                <img src={this.props.song.album.picUrl}/>
              </div>
              <div className="song-lyric">
                  <Lyric song={this.props.song} play={this.props.play} time={this.props.time}/>
              </div>
            </div>    
            <div className="song-comment">
                <Comment id={this.props.song.commentThreadId} />
            </div>
          </div>
        </div>
    );
  }
});

export default Song;