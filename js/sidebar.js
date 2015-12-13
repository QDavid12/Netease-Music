import React from 'react';

let Sidebar = React.createClass({

  render() {
    return(
        <div className="sidebar grey">
        <div className="section">

          <div className="title">推荐</div>

          <div className="list active">
            <div className="content">
              <i className="glyphicon glyphicon-music"></i>
              <span className="name">发现音乐</span>
            </div>
          </div>

          <div className="list">
            <div className="content">
              <i className="glyphicon glyphicon-headphones"></i>
              <span className="name">私人FM</span>
            </div>
          </div>

          <div className="list">
            <div className="content">
              <i className="glyphicon glyphicon-expand"></i>
              <span className="name">MV</span>
            </div>
          </div>

          <div className="list">
            <div className="content">
              <i className="glyphicon glyphicon-user"></i>
              <span className="name">朋友</span>
            </div>
          </div>

        </div>
        <div className="section">

          <div className="title">我的音乐<i className="glyphicon glyphicon-menu-right"></i></div>

          <div className="list">
            <div className="content">
              <i className="glyphicon glyphicon-folder-open"></i>
              <span className="name">本地音乐</span>
            </div>
          </div>

          <div className="list">
            <div className="content">
              <i className="glyphicon glyphicon-download-alt"></i>
              <span className="name">下载的音乐</span>
            </div>
          </div>

        </div>
        <div className="section">

          <div className="title">创建的歌单<i className="glyphicon glyphicon-plus-sign"></i></div>

          <div className="list">
            <div className="content">
              <i className="glyphicon glyphicon-heart-empty"></i>
              <span className="name">我喜欢的音乐</span>
            </div>
          </div>

          <div className="list">
            <div className="content">
              <i className="glyphicon glyphicon-list"></i>
              <span className="name">示例歌单</span>
            </div>
          </div>

        </div>
      <div className="small-album grey">
        <div className="cover"></div>
        <div className="info">
          <a href="#" className="name"><span>平凡之路</span></a>
          <a href="#" className="artist"><span>朴树</span></a>
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

export default Sidebar;