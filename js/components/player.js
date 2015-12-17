import React from 'react';
import PlayListBox from './playListBox';

let Player = React.createClass({
  getInitialState: function(){
    //console.log(this.props);
    return{
      pace: 0,
      time: "00:00",
      duration: "00:00",
      playListBox: false,
      mode: this.props.mode
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
    if(song!=undefined){
      this.setState({pace: 0, time: "00:00"})
      audio.src = song.mp3Url;
      audio.load();
      audio.play();
    }
  },
  componentDidUpdate: function(){
    console.log("player update");
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
    }.bind(this));
    this.refs.audio.addEventListener("canplay", function(){
      console.log("canplay");
      //this.setState({playing: true});
    }.bind(this));
    this.refs.audio.addEventListener("durationchange", function(){
      console.log("durationchange" + this.refs.audio.duration);
      this.setDuration();
    }.bind(this));
    this.refs.audio.addEventListener("timeupdate", function(){
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
      this.refs.audio.pause();
      this.onmoving = this.refs.paceCursor;
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
        console.log(width);
        var ratio = width/maxWidth;
        var time = ratio * this.refs.audio.duration;
        var min = parseInt(time/60);
        var second = parseInt(time-min*60);
        var timeStr = (min>9?min.toString():"0"+min) + ":" + (second>9?second.toString():"0"+second);
        this.setState({pace: (ratio*100).toFixed(2), time: timeStr});
      }
    }.bind(this));
    document.addEventListener("mouseup", function(e){
      if(this.onmoving){
        console.log("mouseup");
        this.onmoving = false;
        this.refs.audio.play();
        this.refs.audio.currentTime = (this.state.pace*this.refs.audio.duration)/100;
      }
    }.bind(this));
    document.addEventListener("mousedown", function(){
      
    }.bind(this))
  },
  playTimeChange: function(e){
    //bug
    return;
    if(this.refs.audio.src==""||this.refs.audio.src==undefined){
      return;
    }
    var container = e.target;
    var maxWidth = container.offsetWidth;
    var width = e.clientX - getOffset(container);
    console.log(width/maxWidth);
    var ratio = width/maxWidth;
    var time = ratio * this.refs.audio.duration;
    var min = parseInt(time/60);
    var second = parseInt(time-min*60);
    var timeStr = (min>9?min.toString():"0"+min) + ":" + (second>9?second.toString():"0"+second);
    this.setState({pace: (ratio*100).toFixed(2), time: timeStr});
    this.refs.audio.play();
    this.refs.audio.currentTime = (ratio*this.refs.audio.duration);
  },
  togglePlayList: function(){
    this.setState({playListBox: !this.state.playListBox});
  },
  switchPlay: function(e){
    var key = parseInt(e.target.id.split("-")[1]);
    console.log(key);
    this.props.action("changeNum", key);
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

        <audio ref="audio"/>

        <div className="panel">
          <div className="pace-container">
            <div className="pace" onClick={this.playTimeChange}>
              <div className="already" style={{width: this.state.pace+"%"}}>
                <div className="cursor" ref="paceCursor"><div className="point"></div></div>
              </div>
            </div>
            <div className="time">
              <span>{this.state.time}</span> / <span>{this.state.duration}</span>
            </div>
          </div>
        </div>
        <div className="right">
          <div className="volume-container">
            <i className="glyphicon glyphicon-volume-up"></i>
            <div className="pace">
              <div className="already">
                <div className="cursor"></div>
              </div>
            </div>
          </div>
          <i className="widget glyphicon glyphicon-random"></i>
          <div className="widget lyric"><span>词</span></div>
          <i className="widget glyphicon glyphicon-tasks" onClick={this.togglePlayList}></i>
          <span className="tasks-number">{this.props.playList.length}</span>
          { playListBox }
        </div>
      <div className="small-album grey">
        <div className="cover"><img src={song.album.picUrl} /></div>
        <div className="info">
          <a href="#" className="name"><span>{song.name}</span></a>
          <a href="#" className="artist"><span>{song.artists[0].name}</span></a>
        </div>
        <div className="tools">
          <i className="glyphicon glyphicon-share"></i>
          <i className="glyphicon glyphicon-heart-empty"></i>
        </div>
      </div>
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