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
            <div className="col">
              <Link to="/">Home</Link>
            </div>
            
            <div className="col">
              <Link to="/addcity">Cities</Link>
            </div>

            <div className="col">
              <Link to="/addtour">Tour</Link>
            </div>
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