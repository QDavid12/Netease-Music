import React from 'react';

let Player = React.createClass({
  getInitialState: function(){
    console.log(this.props);
    return{
      playList: this.props.playList,
      playing: false,
      num: 0
    }
  },
  play: function(){
    if(this.state.playing){
      this.refs.audio.pause();
    }
    else{
      this.refs.audio.play();
    }
    this.setState({playing: !this.state.playing});
  },
  next: function(){
    this.refs.audio.pause();
    this.setState({num: this.state.num+1, playing: true})
  },
  back: function(){
    this.refs.audio.pause();
    this.setState({num: this.state.num-1, playing: true})
  },
  componentDidUpdate: function(){
    console.log("update");
    console.log(this.state);
    if(this.state.playing){
      this.refs.audio.play();
    }
    else{
      this.refs.audio.pause();
    }
  },
  render: function(){
    //this.props.action("getSongDetail", ["28815250"]);
    console.log(this.state.playList[this.state.num]);
    var playerClass = "control play glyphicon glyphicon-" + (!this.state.playing?"play":"pause");
    return(
        <div className="player grey">
        <i onClick={this.back} className="control last glyphicon glyphicon-step-backward"></i>
        <i onClick={this.play} className={playerClass}></i>
        <i onClick={this.next} className="control next glyphicon glyphicon-step-forward"></i>


        <div className="panel">
          <div className="pace-container">
            <div className="pace">
              <div className="already">
                <div className="cursor"><div className="point"></div></div>
              </div>
            </div>
            <div className="time">
              <span>00:13</span> / <span>03:47</span>
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