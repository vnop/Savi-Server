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


<nav class="navbar navbar-toggleable-md navbar-light bg-faded">
  <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <a class="navbar-brand" href="#">Navbar</a>
  <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav">
      <li class="nav-item active">
        <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Features</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Pricing</a>
      </li>
      <li class="nav-item">
        <a class="nav-link disabled" href="#">Disabled</a>
      </li>
    </ul>
  </div>
</nav>


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