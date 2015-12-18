import React from 'react';

let Lyric = React.createClass({
  render() {
    return(
        <div className="lyric-container">
          {this.props.song.id}
        </div>
    );
  }
});

export default Lyric;