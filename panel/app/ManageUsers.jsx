import React from 'react';
import { BrowserRouter as Router, Match, Route, Link } from 'react-router-dom';

class AddCity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      //form field states
      userName: req.body.profileData.name,
      userEmail: req.body.profileData.email,
      mdn: req.body.profileData.phone,
      country: req.body.profileData.country,
      // photo: req.body.profileData.,
      // city: req.body.profileData.city,
      // languages: req.body.profileData.,
      userAuthId: req.body.userId
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