import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Home from './Home.jsx';
import Styles from '../styles/styles.js';
import AddCity from './AddCity.jsx';
import AddTour from './AddTour.jsx';
import ManageUsers from './ManageUsers.jsx';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <div style={Styles.mainContainer} className="main-container">
          <div style={Styles.innerWrapper} className="inner-wrapper">
            <nav style={Styles.navbar} className="navbar">
              <div style={Styles.navInnerWrapper} className="nav-inner-wrapper">
                <div className="workers-nav">
                  <span id="navItem" className="nav-item">
                    <Link to="/">Driver</Link>
                  </span>

                  <span id="navItem" className="nav-item">
                    <Link to="/addcity">Tour Guide</Link>
                  </span>
                </div>

                <div className="tourist-nav test">
                  <span id="navItem" className="nav-item">
                    <Link to="/">Home</Link>
                  </span>

                  <span id="navItem" className="nav-item">
                    <Link to="/addcity">Cities</Link>
                  </span>

                  <span id="navItem" className="nav-item">
                    <Link to="/addtour">Tour</Link>
                  </span>

                  <span id="navItem" className="nav-item">
                    <Link to="/manageusers">Manage Users</Link>
                  </span>

                </div>
              </div>
            </nav>
            <div style={Styles.logoWrapper} className="logo-wrapper">
              <img id="saviLogo" src="../assets/savi_logo.png"/>
            </div>

            <hr/>

            <Route exact path="/" component={Home}/>
            <Route path="/addcity" component={AddCity}/>
            <Route path="/addtour" component={AddTour}/>
            <Route path="/manageusers" component={ManageUsers}/>
          </div>
        </div>
      </Router>
    )
  }
}

module.exports = App;