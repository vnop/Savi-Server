import React from 'react';
import { BrowserRouter as Router, Match, Route, Link } from 'react-router-dom';
import config from '../../config/config.js';

class AddCity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      //form field states
      cityName: '',
      cityImg: ''
    };

    //METHOD BINDINGS
    this.nameForm = this.nameForm.bind(this);
    this.imageForm = this.imageForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //FORM CONTROLS
  nameForm(e) {this.setState({ cityName: e.target.value })}
  imageForm(e) {this.setState({ cityImg: e.target.value })}

  handleSubmit(e) {
    e.preventDefault();//stops page refresh on submit

    let exists = this.state.data.filter((obj)=>{
      return obj.name.toLowerCase() === this.state.cityName.toLowerCase();
    }).length>0;

    if (exists) {//city already exists...
      alert('City alredy exists...');
    } else {//otherewise...
      //POST REQEUST
      fetch('https://savi-travel.com:'+config.port+'/api/cities', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: this.state.cityName,
          mainImage: this.state.cityImg
        })
      }).then((res) => {
        // this.state.data.push({
        //   name: this.state.cityName,
        //   mainImage: this.state.cityName.replace(' ', '-').toLowerCase()+'_city.jpg'
        // });
        fetch('https://savi-travel.com:'+config.port+'/api/cities')
          .then(resp => resp.json())
          .then(data => this.setState({data}))
          .catch(err => console.error(err));
      });
      this.setState({ cityName: '', cityImg: '' }); //Clear the form after submission
    }
  }

  //INITIAL DATA FETCH
  componentWillMount() {
    fetch('https://savi-travel.com:'+config.port+'/api/cities')
      .then(resp => resp.json())
      .then(data => this.setState({data.reverse()}))
      .then(data => console.log(this.state))
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div className="add-cities-component">
        <div className="form-wrapper">
          <h3>Add New City</h3>
          <form className="centered-form" onSubmit={this.handleSubmit}>
            <div className="input-wrapper">
              <label>City</label>
              <input type="text" value={this.state.cityName} onChange={this.nameForm} />
            </div>

            <div className="input-wrapper">
              <label>Image</label>
              <input type="text" value={this.state.cityImg} onChange={this.imageForm} />
            </div>

            <input type="submit" value="Add" />
          </form>
        </div>

        <div className="available-records">
          <h2>Available Cities</h2>
          {this.state.data.map((item, i) => {
            return (
              <div className="record-container" key={i}>
                <p className="record-name">{item.name}</p>
                <div className="image-wrapper">
                  <img className="record-images" src={"https://savi-travel.com:"+config.port+"/api/images/"+item.mainImage} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

module.exports = AddCity;