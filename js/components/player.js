import React from 'react';

let Player = React.createClass({
  getInitialState: function(){
    console.log(this.props);
    return{
      playList: this.props.playList,
      playing: false,
      num: 0,
      pace: 0,
      time: "00:00",
      duration: "00:00"
    }
  },
  setDuration: function(){
    var duration = this.refs.audio.duration;
    var dmin = parseInt(duration/60);
    var dsecond = parseInt(duration-dmin*60);
    this.setState({
      duration: (dmin>9?dmin.toString():"0"+dmin) + ":" + (dsecond>9?dsecond.toString():"0"+dsecond)
    })
  },
  setTime: function(){
    var duration = this.refs.audio.duration;
    var time = this.refs.audio.currentTime;
    var min = parseInt(time/60);
    var second = parseInt(time-min*60);
    this.setState({
      time: (min>9?min.toString():"0"+min) + ":" + (second>9?second.toString():"0"+second),
      pace: ((time/duration)*100).toFixed(2)
    });
  },
  play: function(){
    var audio = this.refs.audio;
    if(audio.paused){
      this.refs.audio.play();
    }
    else{
      this.refs.audio.pause();
    }
    //this.setState({playing: !this.state.playing});
  },
  next: function(){
    var num = this.state.num;
    this.refs.audio.pause();
    this.refs.audio.src = this.state.playList[this.state.num+1];
    this.refs.audio.load();
    this.refs.audio.play();
    this.setState({num: this.state.num+1})
  },
  back: function(){
    var num = this.state.num;
    this.refs.audio.pause();
    this.refs.audio.src = this.state.playList[this.state.num-1];
    this.refs.audio.load();
    this.refs.audio.play();
    this.setState({num: this.state.num-1})
  },
  componentDidUpdate: function(){

  },
  componentDidMount: function () {
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
    }.bind(this));
    /*pace control*/
    this.refs.paceCursor.addEventListener("mousedown", function(e){
      console.log("mousedown");
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
        this.setState({pace: ((width/maxWidth)*100).toFixed(2)});
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
    function getOffset(e){
      var o = e.offsetLeft;
      if(e.offsetParent!=null){
        o += getOffset(e.offsetParent);
      }
      return o;
    }
    console.log(this.state.playList[this.state.num]);
    this.refs.audio.src = this.state.playList[this.state.num];
    this.refs.audio.load();
  },
  render: function(){
    var playerClass = "control play glyphicon glyphicon-" + (!this.state.playing?"play":"pause");
    return(
        <div className="player grey">
        <i onClick={this.back} className="control last glyphicon glyphicon-step-backward"></i>
        <i onClick={this.play} className={playerClass}></i>
        <i onClick={this.next} className="control next glyphicon glyphicon-step-forward"></i>

        <audio ref="audio"/>

        <div className="panel">
          <div className="pace-container">
            <div className="pace">
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
          <i className="widget glyphicon glyphicon-tasks"></i>
          <span className="tasks-number">10</span>
        </div>
    </div>
    );
  }
});

export default Player;