import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery'

let Sidebar = React.createClass({
  active(e) {
    //console.log("active");
    $('.songlist-links').removeClass("active");
    this.getlink($(e.target)[0]);
  },
  getlink(e){
    console.log(e.tagName);
    if(e.tagName=="A"){
      //console.log("find");
      $(e).addClass("active");
      return;
    }
    else{
      //console.log($(e).parent());
      this.getlink($(e).parent()[0]);
    }
  },
  render() {
    console.log("sidebar");
    //console.log(this.props.userSonglist);
    var subscribedLists = [];
    var myLists = [];
    for(var i in this.props.userSonglist){
      var list = this.props.userSonglist[i];
      if(list.userId == this.props.uid){
        myLists.push(list);
      }
      else{
        subscribedLists.push(list);
      }
    }
    return(
        <div className="sidebar grey" style={{height: "-webkit-calc(100% - "+(this.props.radio?"152px":"252px")+")"}}>
        <div className="section">

          <div className="title">推荐</div>

          <Link onClick={this.active} className="songlist-links" to="/discover">
          <div className="list">
            <div className="content">
              <i className="glyphicon glyphicon-music"></i>
              <span className="name">发现音乐</span>
            </div>
          </div>
          </Link>

          <Link onClick={this.active} className="songlist-links" to="/radio">
          <div className="list">
            <div className="content">
              <i className="glyphicon glyphicon-headphones"></i>
              <span className="name">私人FM</span>
            </div>
          </div>
          </Link>

          <Link onClick={this.active} className="songlist-links" to="/">
          <div className="list">
            <div className="content">
              <i className="glyphicon glyphicon-expand"></i>
              <span className="name">MV</span>
            </div>
          </div>
          </Link>

          <Link onClick={this.active} className="songlist-links" to="/">
          <div className="list">
            <div className="content">
              <i className="glyphicon glyphicon-user"></i>
              <span className="name">朋友</span>
            </div>
          </div>
          </Link>

        </div>
        <div className="section">

          <div className="title">我的音乐<i className="glyphicon glyphicon-menu-right"></i></div>

          <Link onClick={this.active} className="songlist-links" to="/">
          <div className="list">
            <div className="content">
              <i className="glyphicon glyphicon-folder-open"></i>
              <span className="name">本地音乐</span>
            </div>
          </div>
          </Link>

          <Link onClick={this.active} className="songlist-links" to="/">
          <div className="list">
            <div className="content">
              <i className="glyphicon glyphicon-download-alt"></i>
              <span className="name">下载的音乐</span>
            </div>
          </div>
          </Link>

        </div>
        <div className="section">

          <div className="title">创建的歌单<i className="glyphicon glyphicon-plus-sign"></i></div>

          {
            myLists.map(function (list) {
              var listClass = "glyphicon glyphicon-" + (list["isFirst"]?"heart-empty":"list");
              return (
                <Link onClick={this.active} className="songlist-links" to={"/songlist/"+list.id} query={list} key={list.id}>
                  <div className="list">
                    <div className="content">
                      <i className={listClass}></i>
                      <span className="name">{list.name}</span>
                    </div>
                  </div>
                </Link>
              )
            }.bind(this))
          }

        </div>

        <div className="section">

          <div className="title">收藏的歌单</div>

          {
            subscribedLists.map(function (list) {
              return (
                <Link onClick={this.active} className="songlist-links" to={"/songlist/"+list.id} query={list} key={list.id}>
                  <div className="list">
                    <div className="content">
                      <i className="glyphicon glyphicon-list"></i>
                      <span className="name">{list.name}</span>
                    </div>
                  </div>
                </Link>
              )
            }.bind(this))
          }

        </div>
      </div>
    );
  }
});

export default Sidebar;