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
      mdn: '', //mobile device number
      cityId: ''
    };

    //METHOD BINDINGS
    this.nameForm = this.nameForm.bind(this);
    this.emailForm = this.emailForm.bind(this);
    this.mdnForm = this.mdnForm.bind(this);
    this.cityForm = this.cityForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //FORM CONTROL
  nameForm(e) {this.setState({ userName: e.target.value })}
  emailForm(e) {this.setState({ userEmail: e.target.value })}
  mdnForm(e) {this.setState({ mdn: e.target.value })}
  cityForm(e) {this.setState({ cityId: e.target.value })}

  handleSubmit(e) {
    e.preventDefault();
    console.log('LOGGING', this.props.method);
  }

  componentWillMount() {
    console.log("What's the method?", this.props.method);
    //Reset unused form fields when search method changes
    if (this.props.method==='userName') { //if the method is userName, reset all else
      this.state.userEmail = '';
      this.state.mdn = '';
      this.state.cityId = '';
    } else if (this.props.method==='userEmail') { //if the method is userEmail, reset all else
      this.state.userName = '';
      this.state.mdn = '';
      this.state.cityId = '';
    } else if (this.props.method==='mdn') { //if the method is mdn, reset all else
      this.state.userName = '';
      this.state.userEmail = '';
      this.state.cityId = '';
    } else if (this.props.method==='cityId') { //if the method is cityId, reset all else
      this.state.userName = '';
      this.state.userEmail = '';
      this.state.mdn = '';
    }
  }

  render() {
    //check for the value of the props.method to determine which form to render
    if (this.props.method==='userName') {//if the search method is by userName
      return (
        <form onSubmit={this.handleSubmit}>BY USERNAME
          <input type="text" value={this.state.userName} onChange={this.nameForm} />
          <input type="submit" value="Search" />
        </form>
      )
    } else if (this.props.method==='userEmail') {//if the search method is by userEmail
      return (
        <form onSubmit={this.handleSubmit}>BY USEREMAIL
          <input type="text" value={this.state.userEmail} onChange={this.emailForm} />
          <input type="submit" value="Search" />
        </form>
      )
    } else if (this.props.method==='mdn') {//if the search method is by mdn (mobile device number)
      return (
        <form onSubmit={this.handleSubmit}>BY MDN
          <input type="text" value={this.state.mdn} onChange={this.mdnForm} />
          <input type="submit" value="Search" />
        </form>
      )
    } else if (this.props.method==='cityId') {//if the search method is by userName
      return (
        <form onSubmit={this.handleSubmit}>BY CITY
          <input type="text" value={this.state.cityId} onChange={this.cityForm} />
          <input type="submit" value="Search" />
        </form>
      )
    }
  }//End of Component Render
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
        <DynamicForms method={this.state.method}/>
      </div>
    )
  }
}

module.exports = ManageUsers;