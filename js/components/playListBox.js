import React from 'react';

let PlayListBox = React.createClass({
    render: function(){
        var i=-1;
        return (
            <div className="tasks-box">
            <div className="title">播放列表</div>
            <div className="content">
              <table>
                <tbody>
                {
                  this.props.playList.map(function(song){
                    i+=1;
                    return(
                      <tr key={i} className={(i==this.props.num?"active":"")+" tr"+i%2}>
                        <td className="status"><i className="glyphicon glyphicon-play"></i></td>
                        <td className="name" id={"song-"+i} onClick={this.props.switchPlay}>{song.name}</td>
                        <td className="artists">{song.artists[0].name}</td>
                      </tr>
                    )
                  }.bind(this))
                }
                </tbody>
              </table>
            </div>
          </div>
        )
    }
});

export default PlayListBox;