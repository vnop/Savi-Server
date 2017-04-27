import React from 'react';
import config from '../../config/config.js';
import { Redirect } from 'react-router';

window.loggedIn = false;

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.attemptSignin = this.attemptSignin.bind(this);
  }

  attemptSignin(e) {
    e.preventDefault();
    let uName = this.refs.uName.value;
    let pWord = this.refs.pWord.value;
    fetch('https://savi-travel.com:' + config.port + '/api/admin', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userName: uName,
          password: pWord
        })
      }).then((res) => {
        if (res.status === 200) {
          console.log('LOGGED IN');
          window.loggedIn = true;
          this.forceUpdate();
        } else {
          console.log('INCORRECT USERNAME OR PASSWORD');
          alert('Incorrect Username or Password');
        }
      });

  }

  render() {
    return loggedIn ? (<Redirect to="/"/>) :
    (
      <div>
        <form onSubmit={this.attemptSignin}>
          Username: <input type="text" ref="uName"></input>
          Password: <input type="password" ref="pWord"></input>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

module.exports = Login;