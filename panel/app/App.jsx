import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Home from './Home.jsx';
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
        <div className="container">
          <div className="col">
            <div className="row">

              <nav className="navbar navbar-toggleable-md navbar-light bg-faded">
                <div className="navbar-nav mr-auto">
                  <img id="saviLogo" src="../assets/savi_logo.png"/>
                  
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
              </nav>

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