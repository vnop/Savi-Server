import React from 'react';
import { BrowserRouter as Router, Match, Route, Link } from 'react-router-dom';
import config from '../../config/config.js';

//HELPER FOR FORMS
class DynamicForms extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: [], //empty array to store search results upon fetch
      //form field states
      userName: '',
      userEmail: '',
      mdn: '', //mobile device number
      cityId: 0
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
    e.preventDefault();//prevent page refresh upon submit
    console.log("userName is:", this.state.userName);
    if (this.state.userName.length<1) {//if the userName isn't blank...
      fetch('https://savi-travel.com:'+config.port+'/api/users?userName='+this.state.userName)
        .then(resp => resp.json())
        .then(data => this.setState({data}))
        .catch(err => console.error(err));
    }
    console.log('Received', this.state.data);
  }

  //DidUpdate _> Runs whenever the page updates due to render
  componentDidUpdate() {
    const s = this.state;
    const defaults = { //Default values to make checks agaist and a central place to make changes
      userName: '',
      userEmail: '',
      mdn: '',
      cityId: 0
    };
    //Resets unused form fields when search method changes
    //If you need to change default values, do so in the "defaults" const above
    if (this.props.method==='userName') { //USERNAME
      //if the method is userName, reset all other forms
      //if forms are already blank, do not set state (prevent forcing a render when not needed)
      if (s.userEmail!==defaults.userEmail) {this.state.userEmail = defaults.userEmail};
      if (s.mdn!==defaults.mdn) {this.state.mdn = defaults.mdn};
      if (s.cityId!==defaults.cityId) {this.state.cityId = defaults.cityId};
    } else if (this.props.method==='userEmail') { //USEREMAIL
      //if the method is userEmail, reset all other forms
      if (s.userName!==defaults.userName) {this.state.userName = defaults.userName};
      if (s.mdn!==defaults.mdn) {this.state.mdn = defaults.mdn};
      if (s.cityId!==defaults.cityId) {this.state.cityId = defaults.cityId};
    } else if (this.props.method==='mdn') { //USER MOBILE DEVICE NUMBER
      //if the method is mdn, reset all other forms
      if (s.userName!==defaults.userName) {this.state.userName = defaults.userName};
      if (s.userEmail!==defaults.userEmail) {this.state.userEmail = defaults.userEmail};
      if (s.cityId!==defaults.cityId) {this.state.cityId = defaults.cityId};
    } else if (this.props.method==='cityId') { //USER CITY
      //if the method is cityId, reset all other forms
      if (s.userName!==defaults.userName) {this.state.userName = defaults.userName};
      if (s.userEmail!==defaults.userEmail) {this.state.userEmail = defaults.userEmail};
      if (s.mdn!==defaults.mdn) {this.state.mdn = defaults.mdn};
    }
  }

  render() {
    //check for the value of the props.method to determine which form to render
    if (this.props.method==='userName') {//if the search method is by userName
      return (
        <div>
          {JSON.stringify(this.state.data)}
          <form onSubmit={this.handleSubmit}>
            <input type="text" value={this.state.userName} onChange={this.nameForm} />
            <input type="submit" value="Search" />
          </form>
        </div>
      )
    } else if (this.props.method==='userEmail') {//if the search method is by userEmail
      return (
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.userEmail} onChange={this.emailForm} />
          <input type="submit" value="Search" />
        </form>
      )
    } else if (this.props.method==='mdn') {//if the search method is by mdn (mobile device number)
      return (
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.mdn} onChange={this.mdnForm} />
          <input type="submit" value="Search" />
        </form>
      )
    } else if (this.props.method==='cityId') {//if the search method is by userName
      return (
        <form onSubmit={this.handleSubmit}>
          <select onChange={this.cityForm} value={this.state.cityId}>
            {this.props.cityData.map((item, i) => {
              return (
                <option key={i} value={item.id}>{item.name}</option>
              )
            })}
          </select>
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

  componentWillMount() {
    //get the current city list
    fetch('https://savi-travel.com:'+config.port+'/api/cities', {mode: 'no-cors'})
      .then(resp => resp.json())
      .then(data => this.setState({cityData: data}))
      .catch(err => console.error(err));
  }

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
        <DynamicForms method={this.state.method} cityData={this.state.cityData} />
      </div>
    )
  }
}

module.exports = ManageUsers;