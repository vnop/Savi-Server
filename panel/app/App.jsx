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

            <nav className="navbar navbar-light">
              <span id='navbar'>
                <Link to="/">Home</Link>
              </span>

              <span id='navbar'>
                <Link to="/addcity">Cities</Link>
              </span>

              <span id='navbar'>
                <Link to="/addtour">Tour</Link>
              </span>
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