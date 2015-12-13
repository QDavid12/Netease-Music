import React from 'react';
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';

let Nav = React.createClass({

  render() {
    return(
        <div className="nav red">
        <div className="logo">
          <img src="./img/logo.png" alt="logo" />
        </div>
        <Link to="/" className="homelink"><div className="logo-letters">网易云音乐</div></Link>
        <div className="btn-group">
          <i id="btn-back" className="glyphicon glyphicon-menu-left"></i>
          <i id="btn-forward" className="glyphicon glyphicon-menu-right active"></i>
        </div>
        <div className="search-container">
          <i className="glyphicon glyphicon-search"></i>
          <input className="search" placeholder="搜索音乐，歌手，歌词，用户"/>
        </div>
        <div className="tool-right">
          <i className="glyphicon glyphicon-envelope"></i>
          <i className="glyphicon glyphicon-cog"></i>
          <div className="user">
            <Link to="login" className="homelink"><div className="avatar"></div></Link>
            <span className="caret"></span>
       
          </div>
        </div>
      </div>
    );
  }
});

export default Nav;