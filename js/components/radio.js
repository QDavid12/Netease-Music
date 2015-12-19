import React from 'react';
import Lyric from './lyric.js';
import Comment from './comment.js';

let Radio = React.createClass({
  getInitialState: function(){
    console.log("radio init");
    console.log(this.props.radioList.length);
    if(this.props.radioList.length==0){
      this.props.action("getNewRadio", {});
    }
    else{
      this.song = this.props.radioList[this.props.radioNum];
      this.props.action("getLyric", this.song.id);
      this.props.action("getComments", {"rid": this.song.commentThreadId});
    }
    return {

    }
  },
  componentDidUpdate: function(){
    console.log("Radio update");
    console.log(this.props.radioList);
  },
  componentWillReceiveProps: function(nextProps){
    var song = nextProps.radioList[nextProps.radioNum];
    if(song.id!=this.song.id){
      console.log("new song");
      this.song = song;
      this.props.action("getLyric", song.id);
      this.props.action("getComments", {"rid": song.commentThreadId});
    }
  },
  play: function(e){
    var id = parseInt(e.target.id.split("-")[1]);
    //console.log("playRadio "+id);
    this.props.action('playRadio', id);
  },
  render() {
    var buttonClass = "playButton glyphicon glyphicon-"+(this.props.play&&this.props.radio?"pause":"play");
    var thisSong = this.props.radioList[this.props.radioNum];
    console.log(thisSong);
    return(
        <div className="main-content-container radio-container">
          <div className="top">

            <div key={thisSong.id} className="radioCover active">
              <img src={thisSong.album.picUrl} />
              <i className={buttonClass} onClick={this.play} id={"radio-" + this.props.radioNum}></i>
            </div>

            <div className="info-container">
              <Lyric lyric={this.props.lyric} song={this.song} play={this.props.play} time={this.props.time}/>
            </div>
          </div>
          <div className="bottom">
            <Comment comments={this.props.comments} id={this.song.commentThreadId} />
          </div>
        </div>
    );
  }
});

export default Radio;