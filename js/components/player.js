import React from 'react';
import PlayListBox from './playListBox';
import Song from './song.js';
import SmallAlbum from './smallAlbum.js';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

var api = require('../Api');
var action = require('../Action');

let Player = React.createClass({
  getInitialState: function(){
    //console.log(this.props);
    return{
      pace: 0,
      time: "00:00",
      duration: "00:00",
      playListBox: false,
      mode: this.props.mode,
      volume: 30,
      song: false,
      like: false,
      chooseList: false,
      loading: false
    }
  },
  componentWillReceiveProps: function(nextProps){
    console.log("player nextProps");
    var audio = this.refs.audio;
    var play = 0;
    var restart = 0;
    //play
    if(nextProps.play){
      if(audio.paused){
        play = 1;
      }
    }
    //pause
    if(!nextProps.play) audio.pause();
    //restart
    if(nextProps.restart){
      play = 1;
      restart = 1;
    }
    if(play==1&&restart==0) audio.play();
    if(restart==1){
      this.reload(nextProps);
      this.props.action("didRestart");
    }
  },
  setDuration: function(){
    if(this.refs.audio.src==""||this.refs.audio.src==undefined){
      return;
    }
    var duration = this.refs.audio.duration;
    var dmin = parseInt(duration/60);
    var dsecond = parseInt(duration-dmin*60);
    this.setState({
      duration: (dmin>9?dmin.toString():"0"+dmin) + ":" + (dsecond>9?dsecond.toString():"0"+dsecond)
    })
  },
  setTime: function(){
    if(this.refs.audio.src==""||this.refs.audio.src==undefined){
      return;
    }
    var duration = this.refs.audio.duration;
    var time = this.refs.audio.currentTime;
    var min = parseInt(time/60);
    var second = parseInt(time-min*60);
    this.setState({
      time: (min>9?min.toString():"0"+min) + ":" + (second>9?second.toString():"0"+second),
      pace: ((time/duration)*100).toFixed(2)
    });
  },
  playClick: function(){
    if(this.props.play){
      return this.props.action("pause");
    }
    if(this.props.radio){
      return this.props.action("play");
    }
    //playList
    if(this.props.playList.length!=0){
      this.props.action("play");
    }
  },
  nextClick: function(){
    if(this.props.radio){
      if(this.props.radioList[this.props.radioNum+2]==undefined){
        console.log("getNewRadio");
        this.props.action("getNewRadio");
      }
      return this.props.action("next");
    }
    //playList
    if(this.props.playList.length!=0&&this.props.playList[this.props.num+1]!=undefined){
      this.props.action("next");
    }
  },
  backClick: function(){
    if(this.props.radio){
      if(this.props.radioList[this.props.radioNum-1]!=undefined){
        return this.props.action("last");
      }
      return;
    }
    if(this.props.playList.length!=0&&this.props.playList[this.props.num-1]!=undefined){
      this.props.action("last");
    }
  },
  isLiked: function(){
    action.isLiked(this.song.id, function(data){
      console.log("isLiked");
      console.log(data);
      this.setState({like: data});
    }.bind(this))
  },
  reload: function(nextProps){
    //console.log("playSong");
    var audio = this.refs.audio;
    this.setState({pace: 0, time: "00:00"});
    if(nextProps.radio){
      var song = nextProps.radioList[nextProps.radioNum];
    }
    else{
      var song = nextProps.playList[nextProps.num];
    }
    this.song = song;
    this.isLiked();
    if(song!=undefined){
      this.setState({pace: 0, time: "00:00"})
      audio.src = this.props.getUrl(song.hMusic.dfsId);
      audio.load();
      audio.play();
    }
  },
  componentDidUpdate: function(){
    //console.log("player update");
  },
  componentDidMount: function () {
    console.log("player mount");
    this.refs.audio.addEventListener("play", function(){
      this.setState({playing: true});
    }.bind(this));
    this.refs.audio.addEventListener("pause", function(){
      this.setState({playing: false});
    }.bind(this));
    this.refs.audio.addEventListener("loadstart", function(){
      console.log("loadstart");
      this.setState({loading: true});
    }.bind(this));
    this.refs.audio.addEventListener("canplay", function(){
      console.log("canplay");
      this.setState({loading: false});
    }.bind(this));
    this.refs.audio.addEventListener("durationchange", function(){
      console.log("durationchange" + this.refs.audio.duration);
      this.setDuration();
    }.bind(this));
    this.refs.audio.addEventListener("timeupdate", function(){
      if(this.onmoving) return;
      this.setTime();
    }.bind(this));
    this.refs.audio.addEventListener("ended", function(){
      console.log("ended");
      this.nextClick();
    }.bind(this));
    /*pace control*/
    this.refs.paceCursor.addEventListener("mousedown", function(e){
      console.log("mousedown");
      if(this.refs.audio.src==""){
        return;
      }
      //this.refs.audio.pause();
      this.onmoving = this.refs.paceCursor;
    }.bind(this));
    this.refs.volumeCursor.addEventListener("mousedown", function(e){
      console.log("mousedown");
      this.onmoving = this.refs.volumeCursor;
    }.bind(this));
    document.addEventListener("mousemove", function(e){
      if(this.onmoving){
        var already = this.onmoving.parentNode;
        var container = already.parentNode;
        var maxWidth = container.offsetWidth;
        var width = e.clientX - getOffset(container);
        if(width>=maxWidth){
          width = maxWidth;
        }
        if(width<=0){
          width = 0;
        }
        var ratio = width/maxWidth;
        console.log(ratio);
        if(/pace/.test(this.onmoving.className)){
          var time = ratio * this.refs.audio.duration;
          var min = parseInt(time/60);
          var second = parseInt(time-min*60);
          var timeStr = (min>9?min.toString():"0"+min) + ":" + (second>9?second.toString():"0"+second);
          this.setState({pace: (ratio*100).toFixed(2), time: timeStr});
        }
        else{
          console.log("volumeCursor");
          this.refs.audio.volume = ratio;
          this.setState({volume: (ratio*100).toFixed(2)});
        }
      }
    }.bind(this));
    document.addEventListener("mouseup", function(e){
      if(this.onmoving){
        console.log("mouseup");
        if(/pace/.test(this.onmoving.className)){
          //this.refs.audio.play();
          this.refs.audio.currentTime = (this.state.pace*this.refs.audio.duration)/100;
        }
        else{
          console.log("volumeCursor mouseup");
        }
        this.onmoving = false;
      }
    }.bind(this));
    document.addEventListener("mousedown", function(){
      
    }.bind(this))
    this.refs.audio.volume = this.state.volume/100;
  },
  paceChange: function(e){
    //bug
    if(/cursor/.test(e.target.className)){
      return;
    }
    var container = e.target;
    if(!/pace/.test(container.className)){
      container = container.parentNode;
    }
    var isTime = /time/.test(container.className);
    if(this.refs.audio.src==""||this.refs.audio.src==undefined){
      if(isTime) return;
    }
    var maxWidth = container.offsetWidth;
    var width = e.clientX - getOffset(container);
    console.log(width/maxWidth);
    var ratio = width/maxWidth;
    if(isTime){
      var time = ratio * this.refs.audio.duration;
      var min = parseInt(time/60);
      var second = parseInt(time-min*60);
      var timeStr = (min>9?min.toString():"0"+min) + ":" + (second>9?second.toString():"0"+second);
      this.setState({pace: (ratio*100).toFixed(2), time: timeStr});
      this.refs.audio.play();
      this.refs.audio.currentTime = (ratio*this.refs.audio.duration);
    }
    else{
      this.refs.audio.volume = ratio;
      this.setState({volume: (ratio*100).toFixed(2)});
    }
  },
  togglePlayList: function(){
    this.setState({playListBox: !this.state.playListBox});
  },
  switchPlay: function(e){
    var key = parseInt(e.target.id.split("-")[1]);
    console.log(key);
    this.props.action("changeNum", key);
  },
  toggleSong: function(){
    if(this.props.radio){
      return;
    }
    else{
      if(this.props.playList.length==0){
        return;
      }
    }
    this.setState({song: !this.state.song});
  },
  like: function(){
    var like = this.state.like?"false":"true";
    api.like({"like": like, "id": this.song.id}, function(data){
      console.log("radio like "+like);
      console.log(data);
      this.isLiked();
      if(data.code==200){

      }
      else{
        alert("already in there");
      }
    }.bind(this))
  },
  plus: function(){
    this.setState({chooseList: !this.state.chooseList})
  },
  returnValue: function(res){
    console.log("player returnValue");
    console.log(res);
    this.plus();
    if(res=="close") return;
    else{
      console.log(res);
      var song = this.song;
      api.songlistFunc({trackIds: [song.id], pid: res, op: "add"}, function(res){
        console.log(res);
        this.isLiked();
        if(res.code==200){
          alert("add ok");
        }
        else{
          alert("already add");
        }
      }.bind(this))
    }
  },
  render: function(){
    var playerClass = "control play glyphicon glyphicon-" + (!this.props.play?"play":"pause");
    var song = this.props.playList.length==0 ? {album: {picUrl: "./img/logo.png"}, name: "song", artists: [{name: "artist"}]} : this.props.playList[this.props.num];
    if(this.props.radio){
      song = this.props.radioList[this.props.radioNum];
    }
    var i=-1;
    var playListBox;
    if(this.state.playListBox){
      playListBox = <PlayListBox switchPlay={this.switchPlay} playList={this.props.playList} num={this.props.num} />
    }
    else{
      playListBox = ""
    }
    return(
        <div className="player grey">
        <i onClick={this.backClick} className="control last glyphicon glyphicon-step-backward"></i>
        <i onClick={this.playClick} className={playerClass}></i>
        <i onClick={this.nextClick} className="control next glyphicon glyphicon-step-forward"></i>

        <audio id="audio" ref="audio"/>

        <ReactCSSTransitionGroup transitionName="song-container" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
          {this.state.song?<Song returnValue={this.returnValue} chooseList={this.state.chooseList} account={this.props.account} userSonglist={this.props.userSonglist} song={song} like={this.like} plus={this.plus} liked={this.state.like} comments={this.props.comments} lyric={this.props.lyric} play={this.props.play} time={this.state.time} toggleSong={this.toggleSong} action={this.props.action}/>:""}
        </ReactCSSTransitionGroup>

        <div className="panel">
          <div className="pace-container">
            <div className="pace timePace" onClick={this.paceChange}>
              <div className="already" style={{width: this.state.pace+"%"}}>
                <div className={"cursor paceCursor"+(this.state.loading?" loading":"")} ref="paceCursor">
                  <div className="point"></div>
                  <i className="glyphicon glyphicon-repeat"></i>
                </div>
              </div>
            </div>
            <div className="time">
              <span id="timeSpan">{this.state.time}</span> / <span>{this.state.duration}</span>
            </div>
          </div>
        </div>
        <div className="right">
          <div className="volume-container">
            <i className="glyphicon glyphicon-volume-up"></i>
            <div className="pace volumePace" onClick={this.paceChange}>
              <div className="already" style={{width: this.state.volume+"%"}}>
                <div className="cursor" ref="volumeCursor"></div>
              </div>
            </div>
          </div>
          <i className="widget glyphicon glyphicon-random"></i>
          <div className="widget lyric"><span>词</span></div>
          <i className="widget glyphicon glyphicon-tasks" onClick={this.togglePlayList}></i>
          <span className="tasks-number">{this.props.playList.length}</span>
          { playListBox }
        </div>
      <ReactCSSTransitionGroup transitionName="fade" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
        {this.props.radio?"":<SmallAlbum song={song} liked={this.state.like} toggleSong={this.toggleSong}/>}
      </ReactCSSTransitionGroup>
    </div>
    );
  }
});

function getOffset(e){
  var o = e.offsetLeft;
  if(e.offsetParent!=null){
    o += getOffset(e.offsetParent);
  }
  return o;
}

export default Player;