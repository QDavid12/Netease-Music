import React from 'react';

let Artist = React.createClass({
  render() {
    return(
        <div className="main-content-container">
            <div>artist</div>
            <div>{this.props.params.id}</div>
            <div>{this.props.query.name}</div>
        </div>
    );
  }
});

export default Artist;