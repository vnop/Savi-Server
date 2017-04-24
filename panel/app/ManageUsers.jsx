import React from 'react';
import { BrowserRouter as Router, Match, Route, Link } from 'react-router-dom';
import config from '../../config/config.js';

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
    this.transfer = this.transfer.bind(this);
  }

  //TRANSFER DATA BETWEEN COMPONENTS
  transfer(data) {
    this.setState({ data });
    console.log("State in ManageUsers",this.state);
  }

  //FORM CONTROLS
  methodMenu(e) {this.setState({ method: e.target.value })}

  componentWillMount() {
    //get the current city list
    fetch('https://savi-travel.com:'+config.port+'/api/cities', {mode: 'no-cors'})
      .then(resp => resp.json())
      .then(data => this.setState({cityData: data}))
      .catch(err => console.error(err));
  }//

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
        <DynamicForms callback={this.transfer} method={this.state.method} cityData={this.state.cityData} />
        <DisplayUsers data={this.state.data}/>
      </div>
    )
  }//End of Render
}

//COMPONENT FOR RENDERING DIFFERENT FORMS BASED ON SELECTION
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
    e.preventDefault(); //prevent page refresh upon submit
    const searchTerm = () => { //determin a search term to use in our GET request
      if (this.state.userName.length) { //if a username was input...
        return '?userName='+this.state.userName;
      } else if (this.state.userEmail) { //else, if a user email was input...
        return '?userEmail='+this.state.userEmail;
      } else if (this.state.mdn.length) { //else, if an MDN was input...
        return '?mdn='+this.state.mdn;
      } else if (this.state.cityId>0) { //else, if a cityId was selected...
        return '?city='+this.state.cityId;
      } else { //otherwise, return the entire list of users
        return '';
      }
    };
    //GET request for the input data
    fetch('https://savi-travel.com:'+config.port+'/api/users'+searchTerm())
      .then(resp => resp.json())
      .then(data => {
        this.props.callback(data); //sends the data up to the ManageUsers component
      })
      .catch(err => console.error(err));
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
          <form onSubmit={this.handleSubmit}>
            <input type="text" value={this.state.userName} onChange={this.nameForm} />
            <input type="submit" value="Search" />
          </form>
        </div>
      )
    } else if (this.props.method==='userEmail') {//if the search method is by userEmail
      return (
        <div>
          <form onSubmit={this.handleSubmit}>
            <input type="text" value={this.state.userEmail} onChange={this.emailForm} />
            <input type="submit" value="Search" />
          </form>
        </div>
      )
    } else if (this.props.method==='mdn') {//if the search method is by mdn (mobile device number)
      return (
         <div>
          <form onSubmit={this.handleSubmit}>
            <input type="text" value={this.state.mdn} onChange={this.mdnForm} />
            <input type="submit" value="Search" />
          </form>
        </div>
      )
    } else if (this.props.method==='cityId') {//if the search method is by userName
      return (
        <div>
          <form onSubmit={this.handleSubmit}>
            <select onChange={this.cityForm} value={this.state.cityId}>
              <option value={0}>*all</option>
              {this.props.cityData.map((item, i) => {
                return (
                  <option key={i} value={item.id}>{item.name}</option>
                )
              })}
            </select>
            <input type="submit" value="Search" />
          </form>
        </div>
      )
    }
  }//End of Render
}

//COMPONENT TO DYNAMICALLY DISPLAY SEARCH RESULTS AND ALLOW DETAIL EDITING
class DisplayUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    console.log("Component Will Mount";
  }
  componentDidMount() {
    console.log("Component Did Mount";
  }
  componentWillUpdate() {
    console.log("Component Will Update";
  }
  componentDidUpdate() {
    console.log("Component Did Update";
  }

  render() {
    return (
      <div>
        {this.props.data.map((item, i) => {
          return (
            <div key={i}>
              <UserData data={item}/>
            </div>
          )
        })}
      </div>
    )
  }//End of Render
}

//COMPONENT TO RENDER EACH USER ENTRY
//It is recursively returned in the DisplayUser's component.
class UserData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //interal UI
      edit: false,
      //form data
      userName: this.props.data.userName || '',
      userEmail: this.props.data.userEmail || '',
      mdn: this.props.data.mdn || '',
      country: this.props.data.country || '',
      type: this.props.data.type || '',
      cityId: this.props.data.cityId || ''
    };

    //Method Bindings
    this.toggleEdit = this.toggleEdit.bind(this);
    this.nameForm = this.nameForm.bind(this);
  }

  toggleEdit() {
    this.setState({edit: !this.state.edit});
  }

  nameForm(e) {this.setState({userName: e.target.value})};

  render() {
    return (
      <div>
        <button onClick={this.toggleEdit}>{(this.state.edit) ? "Save" : "Edit"}</button>
        {(()=>{
          if (this.state.edit) {
            return (
              <div>
                <input type="text" value={this.state.userName} onChange={this.nameForm}/>
              </div>
            )
          } else {
            return (
              <div>
                {this.state.userName}
              </div>
            )
          }
        })()}
      </div>
    )
  }
}

//Export the ManageUsers component for use within App.jsx
module.exports = ManageUsers;