import React from 'react';
import { BrowserRouter as Router, Match, Route, Link } from 'react-router-dom';

class ManageUsers extends React.Component {
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
    this.nameForm = this.nameForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //FORM CONTROLS
  methodMenu(e) {this.setState({ method: e.target.value })}
  nameForm(e) {this.setState({ method: e.target.value })}

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
              <option value="cityId">City</option>
            </select>
          </label>

          <label>

          </label>

          <input type="submit" value="Search" />
        </form>
      </div>
    )
  }
}

module.exports = ManageUsers;