import React from 'react';
import { BrowserRouter as Router, Match, Route, Link } from 'react-router-dom';

class AddCity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      //form field states
      method: 'userName',
      name: '',
      email: '',
      mdn: 0, //mobile device number
      city: ''
    };

    //METHOD BINDINGS
    this.methodMenu = this.methodMenu.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //FORM CONTROLS
  methodMenu(e) {this.setState({ method: e.target.value })}
  handleSubmit(e) {
    e.preventDefault();
    console.log('LOGGING', this.state.method);
  }

  processData(array, key, val) { //takes and array, a key (as string), and value
    return array.filter((obj) => {
      return obj[key] === val;
    });
  } 

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Search By:
            <select onChange={this.methodMenu} value={this.state.method}>
              <option value="userName">User Name</option>
              <option value="userEmail">Email</option>
              <option value="mdn">Phone Number</option>
              <option value="city">City</option>              
            </select>
          </label>

          <label>
            {(this.method==="userName") ? ()=>{
              return (<div>Search By User Name</div>)} :
              ()=>{
                return (<div>Search By SOMETHING ELSE</div>)
              }
            }
          </label>

          <input type="submit" value="Search" />
        </form>
      </div>
    )
  }
}

module.exports = AddCity;