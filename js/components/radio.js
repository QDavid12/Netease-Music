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
      this.props.action("getFMLyric", this.song.id);
      this.props.action("getFMComments", {"rid": this.song.commentThreadId});
    }
    return {
      time: "00:00"
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
      this.props.action("getFMLyric", song.id);
      this.props.action("getFMComments", {"rid": song.commentThreadId});
    }
  },
  play: function(e){
    var id = parseInt(e.target.id.split("-")[1]);
    //console.log("playRadio "+id);
    this.props.action('playRadio', id);
  },
  componentDidMount: function(){
    this.pace = document.getElementById("timeSpan");
    this.timer = window.setInterval(function(){
      if(this.props.radio&&this.props.play){
        //console.log(this.pace.innerHTML);
        this.setState({time: this.pace.innerHTML})
      }
    }.bind(this), 500);
  },
  componentWillUnmount: function(){
    if(this.timer){
      clearInterval(this.timer);
    }
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
              <Lyric lyric={this.props.FMlyric} song={this.song} play={this.props.play} time={this.state.time}/>
            </div>
          </div>
          <div className="bottom">
            <Comment comments={this.props.FMcomments} id={this.song.commentThreadId} />
          </div>
        </div>
    );
  }
});

export default Radio;