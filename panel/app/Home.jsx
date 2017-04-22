import React from 'react';
import config from '../../config/config.js';
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cityData: []
    }
  }

  componentWillMount() {
    fetch('https://savi-travel.com:'+config.port+'/api/cities', {mode: 'no-cors'})
      .then(resp => resp.json())
      .then(data => this.setState({cityData: data}))
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div className="home-section">
        <div className="callout">
          <h1>People Meeting People</h1>
        </div>

        <div className="cities-images">
          <div className="image">{JSON.stringify(this.state.cityData)}</div>
          <div className="image">Amsterdam</div>
          <div className="image">London</div>
          <div className="image">New York</div>
          <div className="image">Rio de Janeiro</div>
          <div className="image">Shanghai</div>
        </div>
      </div>
    )
  }
}

module.exports = Home;