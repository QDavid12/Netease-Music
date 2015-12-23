import React from 'react';

let Download = React.createClass({
    render: function(){
      console.log("download render");
      console.log(this.props.downloadingList);
        var downloading = [];
        var downloaded = [];
        for(var x in this.props.downloadingList){
          var song = this.props.downloadingList[x];
          downloading.push(
            <tr key={x}>
              <td>{song.name}</td>
              <td>{song.started}</td>
              <td>{song.percent}</td>
            </tr>
          )
        }
        for(var x in this.props.downloadedList){
          var song = this.props.downloadedList[x];
          downloaded.push(
            <tr key={x}>
              <td>{x}</td>
              <td>{song}</td>
            </tr>
          )
        }
        return (
          <div className="main-content-container">
            <table>
              <tbody>
                <tr>
                  <td key="0">downloading</td>
                </tr>
                { downloading }

                <tr key="1">
                  <td>downloaded</td>
                </tr>
                { downloaded }
              </tbody>
            </table>
          </div>
        )
    }
});

export default Download;