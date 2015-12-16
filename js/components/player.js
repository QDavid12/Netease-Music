import React from 'react';

let Player = React.createClass({
  getInitialState: function(){
    console.log(this.props);
    return{
      num: 0,
      pace: 0,
      time: "00:00",
      duration: "00:00",
      playListBox: false,
      mode: this.props.mode
    }
  },
  componentWillReceiveProps: function(nextProps){
    var audio = this.refs.audio
    //mode radio
    if(nextProps.mode=="radio"){
      console.log("radio player");
      //this.setState({mode: nextProps.mode});
      //have to restart
      if(nextProps.radioNum!=this.radioNum){
        this.radioNum = nextProps.radioNum;
        console.log("player change to radio");
        console.log(nextProps.radioNum);
        audio.pause();
        audio.src = nextProps.radio[nextProps.radioNum].mp3Url;
        audio.load();
        if(nextProps.restart==true){
          this.props.didRestart();
          audio.play();
        }
      }
    }
    //playList change and restart immediately
    if(nextProps.playList.length!=0&&nextProps.restart&&nextProps.mode=="playList"){
      this.setState({num: nextProps.start});
      this.props.didRestart();
      console.log("playlist change and restart");
      console.log(nextProps.start);
      //this.start = nextProps.start;
      audio.pause();
      audio.src = nextProps.playList[nextProps.start].mp3Url;
      audio.load();
      audio.play();
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
      if(audio.src==""&&this.props.mode=="playList"){
        if(this.props.playList.length==0){
          return alert("playlist empty!");
        }
        audio.src = this.props.playList[this.state.num].mp3Url;
        audio.load();
      }
      audio.play();
    }
    else{
      audio.pause();
    }
    //this.setState({playing: !this.state.playing});
  },
  next: function(){
    if(this.props.mode=="playList"){
      var num = this.state.num;
      this.refs.audio.pause();
      this.refs.audio.src = this.props.playList[this.state.num+1].mp3Url;
      this.refs.audio.load();
      this.refs.audio.play();
      this.setState({num: this.state.num+1});
    }
    else{
      console.log("next radio");
      this.props.nextRadio();
    }
  },
  back: function(){
    if(this.props.mode=="playList"){
      var num = this.state.num;
      this.refs.audio.pause();
      this.refs.audio.src = this.props.playList[this.state.num-1].mp3Url;
      this.refs.audio.load();
      this.refs.audio.play();
      this.setState({num: this.state.num-1});
    }
    else{
      console.log("last radio");
      this.props.lastRadio();
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
      this.next();
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
    document.addEventListener("mousedown", function(){
      
    }.bind(this))
    function getOffset(e){
      var o = e.offsetLeft;
      if(e.offsetParent!=null){
        o += getOffset(e.offsetParent);
      }
      return o;
    }
    //console.log(this.props.playList[this.state.num]);
    if(this.props.playList&&this.props.playList.length!=0){
      this.refs.audio.src = this.props.playList[this.state.num].mp3Url;
      this.refs.audio.load();
    }
  },
  togglePlayList: function(){
    this.setState({playListBox: !this.state.playListBox});
  },
  switchPlay: function(e){
    var key = parseInt(e.target.id.split("-")[1]);
    console.log(key);
    this.setState({num: key});
    this.refs.audio.pause();
    this.refs.audio.src = this.props.playList[key].mp3Url;
    this.refs.audio.load();
    this.refs.audio.play();
  },
  render: function(){
    var playerClass = "control play glyphicon glyphicon-" + (!this.state.playing?"play":"pause");
    var song = this.props.playList.length==0 ? {album: {picUrl: "./img/logo.png"}, name: "song", artists: [{name: "artist"}]} : this.props.playList[this.state.num];
    var i=-1;
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
          <i className="widget glyphicon glyphicon-tasks" onClick={this.togglePlayList}></i>
          <span className="tasks-number">{this.props.playList.length}</span>
          <div className="tasks-box" onClick={this.togglePlayListBox} style={{display: this.state.playListBox?"block":"none"}}>
            <div className="title">播放列表</div>
            <div className="content">
              <table>
                <tbody>
                {
                  this.props.playList.map(function(song){
                    i+=1;
                    return(
                      <tr className={(i==this.state.num?"active":"")+" tr"+i%2}>
                        <td className="status"><i className="glyphicon glyphicon-play"></i></td>
                        <td className="name" id={"song-"+i} onClick={this.switchPlay}>{song.name}</td>
                        <td className="artists">{song.artists[0].name}</td>
                      </tr>
                    )
                  }.bind(this))
                }
                </tbody>
              </table>
            </div>
          </div>
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

export default Player;