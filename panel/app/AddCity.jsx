import React from 'react';
import { BrowserRouter as Router, Match, Route, Link } from 'react-router-dom';

class AddCity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      cityName: '',
      cityImg: ''
    };

    this.nameForm = this.nameForm.bind(this);
    this.imageForm = this.imageForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  nameForm(e) {
    this.setState({ cityName: e.target.value });
  }

  imageForm(e) {
    this.setState({ cityImg: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();

    let exists = this.state.data.filter((obj)=>{
      return obj.name.toLowerCase() === this.state.cityName.toLowerCase();
    }).length>0;    

    if (exists) {//city already exists...
      alert('City alredy exists...');
    } else {//otherewise...
      //POST REQEUST
      fetch('https://savi-travel.com:8082/api/cities', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: this.state.cityName, 
          mainImage: this.state.cityImg
        })
      });
      this.setState({ cityName: '', cityImg: '' }); //Clear the form after submission
      forceUpdate();
    }
  }

  //INITIAL DATA FETCH
  componentWillMount() {
    fetch('https://savi-travel.com:8082/api/cities', {mode: 'no-cors'})
      .then(resp => resp.json())
      .then(data => this.setState({data}))
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            City:
            <input type="text" value={this.state.cityName} onChange={this.nameForm} />           
          </label>
          <label>
            Image:
            <input type="text" value={this.state.cityImg} onChange={this.imageForm} />           
          </label>
          <input type="submit" value="Add" />
        </form>

        <hr/>

        <h2>Available Cities</h2>
        <div>
          {this.state.data.map((item, i) => {
            return (
              <div key={i}>
                {item.name}
                <img id="cityImgs" src={"https://savi-travel.com:8082/api/images/"+item.mainImage} />
              </div>
            )
          })}
        </div>

      </div>
    )
  }
}

module.exports = AddCity;