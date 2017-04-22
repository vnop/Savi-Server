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
          {this.state.cityData.map((city, i) => {
            return (
              <div
                key={i}
                style={{
                  backgroundImage: "url('https://savi-travel.com:"+config.port+"/api/images/"+city.mainImage+"')",
                  backgroundSize: 'cover'
                }}
                className="image">
                <p className="city-name">{city.name}</p>
              </div>
            )
          })}
        </div>

        <div className="info-section">
          <h3>Information</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat.
          </p>
        </div>

        <div className="footer">
          <div className="footer-links">
            <h3>Footer Of Savi Travel</h3>
            <p>Footer Of Savi Travel</p>
            <p>Footer Of Savi Travel</p>
          </div>

          <div className="social-icons">
            <div className="links-wrapper">
              <div className="image-wrapper">
                <img src="https://kidtrol.com/wp-content/uploads/2015/12/kidtrol-app-download.png" />
              </div>
              <div className="image-wrapper">
                <img src="http://www.thelevites312.com/wp-content/uploads/2013/03/icon-google-play.png" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = Home;