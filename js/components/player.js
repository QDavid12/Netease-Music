import React from 'react';

let Player = React.createClass({

  render() {
    return(
        <div className="player grey">
        <i className="control last glyphicon glyphicon-step-backward"></i>
        <i className="control play glyphicon glyphicon-play"></i>
        <i className="control next glyphicon glyphicon-step-forward"></i>
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