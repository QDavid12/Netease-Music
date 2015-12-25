import React from 'react';
import Lyric from './lyric.js';
import Comment from './comment.js';
import ChooseList from './chooseList.js';

var api = require('../Api');
var action = require('../Action');
var alert = require('./alert').alert;

let Radio = React.createClass({
  getInitialState: function(){
    console.log("radio init");
    console.log(this.props.radioList.length);
    if(this.props.radioList.length==0){
      action.dispatch("getNewRadio", {});
    }
    else{
      this.song = this.props.radioList[this.props.radioNum];
      //this.isLiked();
      action.dispatch("getFMLyric", this.song.id);
      action.dispatch("getFMComments", {"rid": this.song.commentThreadId});
    }
    return {
      time: "00:00",
      chooseList: false
    }
  },
  componentDidUpdate: function(){
    //console.log("Radio update");
    //console.log(this.props.radioList);
  },
  componentWillReceiveProps: function(nextProps){
    var song = nextProps.radioList[nextProps.radioNum];
    if(song.id!=this.song.id){
      console.log("new song");
      this.song = song;
      //this.isLiked();
      action.dispatch("getFMLyric", song.id);
      action.dispatch("getFMComments", {"rid": song.commentThreadId});
    }
  },
  componentDidMount: function(){
    this.pace = document.getElementById("timeSpan");
    this.timer = window.setInterval(function(){
      if(this.props.radio&&this.props.play){
        //console.log(this.pace.innerHTML);
        this.setState({time: this.pace.innerHTML});
      }
    }.bind(this), 500);
  },
  componentWillUnmount: function(){
    if(this.timer){
      clearInterval(this.timer);
    }
  },
  play: function(e){
    var id = parseInt(e.target.id.split("-")[1]);
    //console.log("playRadio "+id);
    action.dispatch('playRadio', id);
  },
  like: function(){
    var like = (this.song.id in this.props.likelist)?"false":"true";
    action.like({"like": like, "id": this.song.id}, function(data){
      console.log("radio like "+like);
      console.log(data);
      //this.isLiked()
      if(data.code==200){
        alert(like=="true"?"收藏成功":"已取消收藏");
      }
      else{
        alert("已经在列表中啦");
      }
    }.bind(this))
  },
  trash: function(){
    api.trash({"id": this.props.radioList[this.props.radioNum].id}, function(data){
      console.log("radio trash");
      console.log(data);
      if(data.code==200){
        alert("已放入垃圾箱");
        this.next();
      }
      else{
        alert("放入垃圾箱失败");
      }
    }.bind(this))
  },
  next: function(){
    if(!this.props.radio){
      action.dispatch("playRadio");
    }
    if(this.props.radioList[this.props.radioNum+2]==undefined){
      console.log("getNewRadio");
      action.dispatch("getNewRadio");
    }
    action.dispatch('next');
  },
  plus: function(){
    this.setState({chooseList: !this.state.chooseList})
  },
  returnValue: function(res){
    this.plus();
    if(res=="close") return;
    else{
      console.log(res);
      var song = this.props.radioList[this.props.radioNum];
      action.songlistFunc({trackIds: [song.id], pid: res, op: "add"}, function(res){
        console.log(res);
        //this.isLiked();
        if(res.code==200){
          alert("收藏成功");
        }
        else{
          alert("已经在列表中啦");
        }
      }.bind(this))
    }
  },
  render() {
    var buttonClass = "playButton glyphicon glyphicon-"+(this.props.play&&this.props.radio?"pause":"play");
    var thisSong = this.props.radioList[this.props.radioNum];
    //console.log(thisSong);
    var like = (thisSong.id in this.props.likelist)?"glyphicon glyphicon-heart":"glyphicon glyphicon-heart-empty";
    var chooseList = "";
    if(this.state.chooseList){
      chooseList = <ChooseList returnValue={this.returnValue} uid={this.props.account.id} userSonglist={this.props.userSonglist}/>
    }
    return(
        <div className="main-content-container radio-container">
          <div className="top">

            <div key={thisSong.id} className="radioCover active">
              <img src={thisSong.album.picUrl} />
              <i className={buttonClass} onClick={this.play} id={"radio-" + this.props.radioNum}></i>
            </div>

            <div className="buttons">
              <div className="button like" onClick={this.like}><i className={like}></i></div>
              <div className="button trash" onClick={this.trash}><i className="glyphicon glyphicon-trash"></i></div>
              <div className="button next" onClick={this.next}><i className="glyphicon glyphicon-step-forward"></i></div>
              <div className="button plus" onClick={this.plus}><i className="glyphicon glyphicon-plus"></i></div>
            </div>

            <div className="info-container">
              <Lyric lyric={this.props.FMlyric} song={this.song} play={this.props.play} time={this.state.time}/>
            </div>

          </div>

          <div className="bottom">
            <Comment comments={this.props.FMcomments} id={this.song.commentThreadId} />
          </div>

          {chooseList}
          
        </div>
    );
  }
});

export default Radio;