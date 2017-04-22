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
      country: '',
      city: ''
    };

    //METHOD BINDINGS
    this.methodMenu = this.methodMenu.bind(this);
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
            <select onChange={this.methodForm} value={this.state.method}>
              <option value="userName">User Name</option>
              <option value="userEmail">Email</option>
              <option value="mdn">Phone Number</option>
              <option value="country">Country</option>
              <option value="city">City</option>              
            </select>
          </label>
          <input type="submit" value="Add" />
        </form>
      </div>
    )
  }
}

module.exports = AddCity;