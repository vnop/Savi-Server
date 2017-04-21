import React from 'react';
import { BrowserRouter as Router, Match, Route, Link } from 'react-router-dom';

class AddCity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      //form field states
      userName: '',
      userEmail: '',
      mdn: '',
      country: '',
      userAuthId: ''
    };
  }

  render() {
    return (
      <div>
        MANAGE USERS
      </div>
    )
  }
}

module.exports = AddCity;