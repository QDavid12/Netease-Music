import React from 'react';

var api = require('../Api');
var action = require('../Action');

let Songlist = React.createClass({
  getInitialState: function() {
    console.log("songlist init");
    this.props.action("songlistDetail", this.props.params.id);
    this.id = this.props.params.id;
    console.log(this.id);
    return {
      
    }
  },
  componentDidUpdate: function(){
    console.log("Songlist" + this.props.params.id);
    console.log("state" + this.id);
    if(this.id!=this.props.params.id){
      this.id = this.props.params.id;
      this.props.action("songlistDetail", this.props.params.id);
    }
  },
  add: function(e){
    var id = e.target.id;
    var song = [];
    var songlist = (this.props.currentSonglist.tracks);
    for(var x=0;x<songlist.length;x++){
      if(songlist[x].id==id){
        song = [songlist[x]];
        break;
      }
    }
    console.log("songlist out");
    this.props.action("addToPlaylist", song);
  },
  playAll: function(){
    this.props.action("changePlayList", this.props.currentSonglist.tracks);
  },
  render: function(){
    console.log("songlist render");
    if(this.props.currentSonglist){
      var songlist = this.props.currentSonglist;
      var j=0;
      var imgUrl = api.getImgUrl(songlist.coverImgId);
      return (
        <div className="main-content-container songlist">
          <div className="info-container">
            <div className="cover"><img className="reflect" src={imgUrl}/></div>
            <div className="info">
              <div className="songlabel">歌单</div>
              <span className="triangle-up"></span>
              <span className="triangle-bottom"></span>
              <div className="name">{songlist.name}</div>
              <div className="creator">创建人：{songlist.creator.nickname}</div>
              <div><button className="play" onClick={this.playAll}>播放</button></div>
            </div>
          </div>
          <div className="tracklist">
            <table className="tracks">
              <thead>
                <tr>
                  <th className="number"></th>
                  <th className="controls">操作</th>
                  <th className="name">音乐标题</th>
                  <th className="artists">歌手</th>
                  <th className="album">专辑</th>
                  <th className="duration">时长</th>
                  <th className="heat">热度</th>
                </tr>
              </thead>
              <tbody>
                {
                  songlist.tracks.map(function(song){
                    var artists = "";
                    j+=1;
                    for(var i=0;i<song.ar.length;i++){artists+=(i==0?"":", ")+song.ar[i].name}
                    return (
                      <tr className={"song tr"+j%2} key={song.id}>
                        <td className="number">{j<10?"0"+j:j}</td>
                        <td className="controls">操作</td>
                        <td className="name" onClick={this.add} id={song.id}>{song.name}</td>
                        <td className="artists">{artists}</td>
                        <td className="album">{song.al.name}</td>
                        <td className="duration">时长</td>
                        <td className="heat">热度</td>
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
    return(
        <div className="main-content-container">

        </div>
    );
  }
});

export default Songlist;
