import React from 'react';
import { BrowserRouter as Router, Match, Route, Link } from 'react-router-dom';

//HELPER FOR FORMS
class DynamicForms extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      //form field states
      userName: '',
      userEmail: '',
      mdn: 0, //mobile device number
      cityId: ''
    };

    //METHOD BINDINGS
    this.nameForm = this.nameForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //FORM CONTROL
  nameForm(e) {this.setState({ method: e.target.value })}

  handleSubmit(e) {
    e.preventDefault();
    console.log('LOGGING', this.state.method);
  }

  render() {
    //For Search By User Name
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" value={this.state.userName} onChange={this.nameForm} />
      </form>
    )
  }
}

//MAIN COMPONENT
class ManageUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      method: 'userName'
    };

    //METHOD BINDINGS
    this.methodMenu = this.methodMenu.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //FORM CONTROLS
  methodMenu(e) {this.setState({ method: e.target.value })}

  render() {
    return (
      <div>
        <form>
          Search By:
          <select onChange={this.methodMenu} value={this.state.method}>
            <option value="userName">User Name</option>
            <option value="userEmail">Email</option>
            <option value="mdn">Phone Number</option>
            <option value="cityId">City</option>
          </select>
        </form>
        <DynamicForms />
      </div>
    )
  }
}

module.exports = ManageUsers;