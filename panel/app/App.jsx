import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Home from './Home.jsx';
import AddCity from './AddCity.jsx';
import AddTour from './AddTour.jsx';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <div className="container">
          <div className="row">

            <nav className="navbar navbar-toggleable-md navbar-light bg-faded">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <Link to="/">Home</Link>
                </li>

                <li className="nav-item">
                  <Link to="/addcity">Cities</Link>
                </li>

                <li className="nav-item">
                  <Link to="/addtour">Tour</Link>
                </li>
              </ul>
            </nav>

          </div>

          <hr/>

          <Route exact path="/" component={Home}/>
          <Route path="/addcity" component={AddCity}/>
          <Route path="/addtour" component={AddTour}/>
        </div>
      </Router>
    )
  }
} 

module.exports = App;