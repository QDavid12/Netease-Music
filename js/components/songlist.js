import React from 'react';

var api = require('../Api');
var action = require('../Action');

let Songlist = React.createClass({
  getInitialState: function() {
    console.log("songlist init");
    //console.log(this.props.query);
    this.props.action("songlistDetail", this.props.params.id);
    this.id = this.props.params.id;
    console.log(this.id);
    return {
      query: this.props.query
    }
  },
  componentWillReceiveProps: function(nextProps){
    if(nextProps.params.id!=this.id){
      console.log("new List");
      console.log(nextProps.query);
      this.setState({query: nextProps.query});
      this.id = nextProps.params.id;
      this.props.action("songlistDetail", nextProps.params.id);
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
  like: function(e){
    var id = e.target.id;
    console.log(id in this.props.likelist);
    action.like({like: !(id in this.props.likelist), id: id})
  },
  render: function(){
    console.log("songlist render");
    console.log(this.props.currentSonglist);
    console.log(this.id);
    console.log(this.props.params.id);
    console.log(this.props.query);
    var songlist = this.props.query;
    var list = (<tr><td style={{width: "100%", textAlign: "center"}}><i className="rotate glyphicon glyphicon-refresh"></i></td></tr>);
    if(this.props.currentSonglist!=undefined){
      if(this.props.currentSonglist.id==this.id){
        songlist = this.props.currentSonglist;
        list = [];
        songlist.tracks.map(function(song, key){
          var artists = "";
          for(var i=0;i<song.artists.length;i++){artists+=(i==0?"":", ")+song.artists[i].name}
          list.push(
            <tr className={"song tr"+key%2} key={song.id}>
              <td className="number">{key<10?"0"+(key+1):(key+1)}</td>
              <td className="controls">
                <i id={song.id} onClick={this.like} className={"glyphicon glyphicon-heart"+(song.id in this.props.likelist?"":"-empty")}></i>
                <i className={"glyphicon glyphicon-"+(song.id in this.props.downloadedList?"ok":"download-alt")}></i>
              </td>
              <td className="name" onClick={this.add} id={song.id}>{song.name}</td>
              <td className="artists">{artists}</td>
              <td className="album">{song.album.name}</td>
              <td className="duration">时长</td>
              <td className="heat">热度</td>
            </tr>
          )
        }.bind(this));
      }
    }
    return (
      <div className="main-content-container songlist">
        <div className="info-container">
          <div className="cover"><img className="reflect" src={songlist.coverImgUrl}/></div>
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
              { list }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
});

export default Songlist;
