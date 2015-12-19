import React from 'react';
import Lyric from './lyric.js';
import Comment from './comment.js';

let Song = React.createClass({
  getInitialState: function(){
    console.log("Song init");
    this.props.action("getLyric", this.props.song.id);
    this.props.action("getComments", {"rid": this.props.song.commentThreadId});
    return {
      song: this.props.song
    }
  },
  componentWillReceiveProps: function(nextProps){
    if(nextProps.song.id!=this.state.song.id){
      console.log("new song");
      this.setState({song: nextProps.song});
      this.props.action("getLyric", nextProps.song.id);
      this.props.action("getComments", {"rid": nextProps.song.commentThreadId});
    }
  },
  render() {
    //console.log("Song render");
    //console.log(this.props.song);
    return(
        <div className="song-container">
          <div className="background blur" style={{backgroundImage: "url("+this.props.song.album.blurPicUrl+")"}}></div>
          <div className="toggle" onClick={this.props.toggleSong}>
            <i className="glyphicon glyphicon-resize-small"></i>
          </div>
          <div className="content">
            <div className="top">
              <div className="song-niddle">
              </div>
              <div className="song-cover" ref="cover" style={{animationPlayState: this.props.play?"running":"paused"}}>
                <img src={this.props.song.album.picUrl}/>
              </div>
              <div className="song-lyric">
                  <Lyric lyric={this.props.lyric} song={this.props.song} play={this.props.play} time={this.props.time}/>
              </div>
            </div> 
            <div className="bottom">   
              <div className="song-comment">
                  <Comment comments={this.props.comments} id={this.props.song.commentThreadId} />
              </div>
            </div>
          </div>
        </div>
    );
  }
});

export default Song;