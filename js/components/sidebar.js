import React from 'react';
import { Link } from 'react-router';

let Sidebar = React.createClass({
  render() {
    console.log("sidebar");
    //console.log(this.props.userSonglist);
    return(
        <div className="sidebar grey">
        <div className="section">

          <div className="title">推荐</div>

          <Link to="/discover">
          <div className="list">
            <div className="content">
              <i className="glyphicon glyphicon-music"></i>
              <span className="name">发现音乐</span>
            </div>
          </div>
          </Link>

          <Link to="/radio">
          <div className="list">
            <div className="content">
              <i className="glyphicon glyphicon-headphones"></i>
              <span className="name">私人FM</span>
            </div>
          </div>
          </Link>

          <Link to="/">
          <div className="list">
            <div className="content">
              <i className="glyphicon glyphicon-expand"></i>
              <span className="name">MV</span>
            </div>
          </div>
          </Link>

          <Link to="/">
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

          <Link to="/">
          <div className="list">
            <div className="content">
              <i className="glyphicon glyphicon-folder-open"></i>
              <span className="name">本地音乐</span>
            </div>
          </div>
          </Link>

          <Link to="/">
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
            this.props.userSonglist.map(function (list) {
              var listClass = "glyphicon glyphicon-" + (list["isFirst"]?"heart-empty":"list");
              return (
                <Link to={"/songlist/"+list.id} key={list.id}>
                  <div className="list">
                    <div className="content">
                      <i className={listClass}></i>
                      <span className="name">{list.name}</span>
                    </div>
                  </div>
                </Link>
              )
            })
          }

        </div>
      </div>
    );
  }
});

export default Sidebar;