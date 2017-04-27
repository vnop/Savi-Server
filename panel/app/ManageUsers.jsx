import React from 'react';
import { BrowserRouter as Router, Match, Route, Link } from 'react-router-dom';
import config from '../../config/config.js';
import countries from './countriesArray.js';

//MAIN COMPONENT
class ManageUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],//container for search results data
      method: 'userName',
      cityData: []
    };

    //METHOD BINDINGS
    this.methodMenu = this.methodMenu.bind(this);
    this.transfer = this.transfer.bind(this);
  }

  //TRANSFER DATA BETWEEN COMPONENTS
  //passed in as a callback prop to DynamicForms component
  transfer(data) {
    if (!Array.isArray(data)) {//check if the data came back as an array
      this.setState({data: [data]});//if not, store it as an array so it can be processed accordingly
    } else {//otherwise, it's already an array
      this.setState({ data });//store it in the state
    }
  };

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
      <div className="manage-users-component">
        <div className="search-container">
          <form className="search-by-form">
            <p>Search By:</p>
            <select onChange={this.methodMenu} value={this.state.method}>
              <option value="userName">User Name</option>
              <option value="userEmail">Email</option>
              <option value="mdn">Phone Number</option>
              <option value="city">City</option>
            </select>
          </form>
          <DynamicForms callback={this.transfer} method={this.state.method} cityData={this.state.cityData} />
        </div>
        <DisplayUsers data={this.state.data} cityData={this.state.cityData}/>
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
      city: ''
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
  cityForm(e) {this.setState({ city: e.target.value })}

  handleSubmit(e) {
    e.preventDefault(); //prevent page refresh upon submit
    const searchTerm = () => { //determin a search term to use in our GET request
      if (this.state.userName.length) { //if a username was input...
        return '?userName='+this.state.userName;
      } else if (this.state.userEmail) { //else, if a user email was input...
        return '?userEmail='+this.state.userEmail;
      } else if (this.state.mdn.length) { //else, if an MDN was input...
        return '?mdn='+this.state.mdn;
      } else if (this.state.city.length) { //else, if a cityId was selected...
        return '?city='+this.state.city;
      } else { //otherwise, return the entire list of users
        return '';
      }
    };
    this.props.callback([]);//Reset the "Data" state in ManageUsers before updating it
    //GET request for the input data
    fetch('https://savi-travel.com:'+config.port+'/api/users'+searchTerm(), {mode: 'no-cors'})
      .then(resp => resp.json())
      .then(data => this.props.callback(data))//sends the data up to the ManageUsers component
      .catch(err => console.error(err));
  }

  //DidUpdate _> Runs whenever the page updates due to render
  componentDidUpdate() {
    const s = this.state;
    const defaults = { //Default values to make checks agaist and a central place to make changes
      userName: '',
      userEmail: '',
      mdn: '',
      city: ''
    };
    //Resets unused form fields when search method changes
    //If you need to change default values, do so in the "defaults" const above
    if (this.props.method==='userName') { //USERNAME
      //if the method is userName, reset all other forms
      //if forms are already blank, do not set state (prevent forcing a render when not needed)
      if (s.userEmail!==defaults.userEmail) {this.state.userEmail = defaults.userEmail};
      if (s.mdn!==defaults.mdn) {this.state.mdn = defaults.mdn};
      if (s.city!==defaults.city) {this.state.city = defaults.city};
    } else if (this.props.method==='userEmail') { //USEREMAIL
      //if the method is userEmail, reset all other forms
      if (s.userName!==defaults.userName) {this.state.userName = defaults.userName};
      if (s.mdn!==defaults.mdn) {this.state.mdn = defaults.mdn};
      if (s.city!==defaults.city) {this.state.city = defaults.city};
    } else if (this.props.method==='mdn') { //USER MOBILE DEVICE NUMBER
      //if the method is mdn, reset all other forms
      if (s.userName!==defaults.userName) {this.state.userName = defaults.userName};
      if (s.userEmail!==defaults.userEmail) {this.state.userEmail = defaults.userEmail};
      if (s.city!==defaults.city) {this.state.city = defaults.city};
    } else if (this.props.method==='city') { //USER CITY
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
        <div className="word-to-search">
          <form onSubmit={this.handleSubmit}>
            <p>Key Word</p>
            <input type="text" value={this.state.userName} onChange={this.nameForm} />
            <input type="submit" value="Search" className="manage-form-submit" />
          </form>
        </div>
      )
    } else if (this.props.method==='userEmail') {//if the search method is by userEmail
      return (
        <div className="word-to-search">
          <form onSubmit={this.handleSubmit}>
            <p>Key Word</p>
            <input type="text" value={this.state.userEmail} onChange={this.emailForm} />
            <input type="submit" value="Search" className="manage-form-submit" />
          </form>
        </div>
      )
    } else if (this.props.method==='mdn') {//if the search method is by mdn (mobile device number)
      return (
         <div className="word-to-search">
          <form onSubmit={this.handleSubmit}>
            <p>Key Word</p>
            <input type="text" value={this.state.mdn} onChange={this.mdnForm} />
            <input type="submit" value="Search" className="manage-form-submit" />
          </form>
        </div>
      )
    } else if (this.props.method==='city') {//if the search method is by userName
      return (
        <div className="word-to-search">
          <form onSubmit={this.handleSubmit}>
            <p>Select City</p>
            <select onChange={this.cityForm} value={this.state.city}>
              {this.props.cityData.map((item, i) => {
                return (
                  <option key={i} value={item.name}>{item.name}</option>
                )
              })}
            </select>
            <input type="submit" value="Search" className="manage-form-submit" />
          </form>
        </div>
      )
    }
  }//End of Render/
}

//COMPONENT TO DYNAMICALLY DISPLAY SEARCH RESULTS AND ALLOW DETAIL EDITING
class DisplayUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="users-data-loop">
        {this.props.data.map((item, i) => {
          return (
            <div className="user-data-container" key={i}>
              <div className="separator"></div>
              <UserData data={item} cityData={this.props.cityData}/>
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
      //interal UI controls
      edit: false,
      //form data
      userAuthId: this.props.data.userAuthId,
      userName: this.props.data.userName,
      userEmail: this.props.data.userEmail,
      mdn: this.props.data.mdn,
      country: this.props.data.country,
      city: this.props.data.city,
      type: this.props.data.type,
      origType: this.props.data.type,
      seats: 0
    };

    //METHOD BINDINGS
    this.toggleEdit = this.toggleEdit.bind(this);
    this.saveHandler = this.saveHandler.bind(this);
    this.nameForm = this.nameForm.bind(this);
    this.emailForm = this.emailForm.bind(this);
    this.mdnForm = this.mdnForm.bind(this);
    this.countryForm = this.countryForm.bind(this);
    this.cityForm = this.cityForm.bind(this);
    this.typeForm = this.typeForm.bind(this);
    this.seatsForm = this.seatsForm.bind(this);
  }

  //FORM CONTROLS
  nameForm(e) {this.setState({userName: e.target.value})};
  emailForm(e) {this.setState({userEmail: e.target.value})};
  mdnForm(e) {this.setState({mdn: e.target.value})};
  countryForm(e) {this.setState({country: e.target.value})};
  cityForm(e) {//specialized cityForm method to handle multiple data returns
    //process the inbound data...
    let data = e.target.value.split(',');
    //set both states
    this.setState({city: data[0], cityId: data[1]});
  };
  typeForm(e) {this.setState({type: e.target.value})};
  seatsForm(e) {this.setState({seats: e.target.value})};
  //toggle edit option for individual users
  toggleEdit() {this.setState({ edit: true })};

  //Events that take place when the "Save" button is clicked
  saveHandler(e) {
    if (this.state.type === "Tourist" && this.state.origType !== "Tourist") {//if the new type is "Tourist"...
      //delete the employee entry for this userId
      fetch('https://savi-travel.com:'+config.port+'/api/employees', {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.props.data.id
        })
      });
    } else if ((this.state.type === "Driver" || this.state.type === "Tour Guide") && this.state.origType === "Tourist") {//otherwise, the new state must be either "Tour Guide" or "Driver"
      //create a new employee entry for this userId
      fetch('https://savi-travel.com:'+config.port+'/api/employees', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: this.state.type,
          rating: 3,
          seats: this.state.seats,
          userId: this.props.data.id,
          city: this.state.city
        })
      });
    } else {//in any other case...
      //send a request to update the employee
      fetch('https://savi-travel.com:'+config.port+'/api/employees/'+this.props.data.id, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: this.state.type,
          rating: 3,
          seats: this.state.seats,
          city: this.state.city
        })
      });
    }

    //PUT REQUEST FOR UPDATING USER INFORMATION
    fetch('https://savi-travel.com:'+config.port+'/api/users/'+this.state.userAuthId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userName: this.state.userName,
        userEmail: this.state.userEmail,
        mdn: this.state.mdn,
        country: this.state.country,
        //photo: this.state.photo,
        type: this.state.type,
        city: this.state.city
      })
    });
    this.setState({ edit: false, origType: this.state.type });//Toggle state back to false when save button is clicked
  }

  componentWillMount() {
    if (this.props.data.type !== "Tourist") {//If the user is not a tourist...
      //get their employee data and set their "seat" value to match what is returned
      fetch('https://savi-travel.com:'+config.port+'/api/employees?userId='+this.props.data.id, {
        method: 'GET'
      }).then(resp => resp.json())
      .then(data => this.setState({seats: data.seats}))
      .catch(err => console.error(err));
    }
  }

  render() {
    return (
      <div className="user-data-inner-container">
        {(()=>{
          if (this.state.edit) {
            return (
              <div className="data-details-edit">
                <div className="data-wrapper">
                  <p className="element">Name:</p>
                  <input type="text" value={this.state.userName} onChange={this.nameForm}/>
                </div>
                <div className="data-wrapper">
                  <p className="element">Email:</p>
                  <input type="text" value={this.state.userEmail} onChange={this.emailForm}/>
                </div>
                <div className="data-wrapper">
                  <p className="element">Phone Number:</p>
                  <input type="text" value={this.state.mdn} onChange={this.mdnForm}/>
                </div>
                <div className="data-wrapper">
                  <p className="element">Country:</p>
                  <select onChange={this.countryForm} value={this.state.country}>
                    {countries.map((item, i) => {
                      return (
                        <option key={i} value={item}>{item}</option>
                      )
                    })}
                  </select>
                </div>
                <div className="data-wrapper">
                  <p className="element">City:</p>
                  <select onChange={this.cityForm} value={this.state.city}>
                    {this.props.cityData.map((item, i) => {
                      return (
                        <option key={i} value={item.name}>{item.name}</option>
                      )
                    })}
                  </select>
                </div>
                <div className="data-wrapper">
                  <p className="element">Status:</p>
                  <select onChange={this.typeForm} value={this.state.type}>
                    <option value="Tourist">Tourist</option>
                    <option value="Driver">Driver</option>
                    <option value="Tour Guide">Tour Guide</option>
                  </select>
                </div>
                {(()=>{
                  if (this.state.type === "Driver") {
                    return (
                      <div>
                      Available Seats:
                        <select onChange={this.seatsForm} value={this.state.seats}>
                          {[0,1,2,3,4,5,6,7,8,9,10].map((item, i) => {
                            return (
                              <option key={i} value={item}>{item}</option>
                            )
                          })}
                        </select>
                      </div>
                    )
                  }
                })()}
              </div>
            )
          } else {
            return (
              <div className="data-details-display">
                <div className="data-wrapper">
                  <p className="element">Name:</p>
                  <p className="data">{this.state.userName}</p>
                </div>
                <div className="data-wrapper">
                  <p className="element">Email:</p>
                  <p className="data">{this.state.userEmail}</p>
                </div>
                <div className="data-wrapper">
                  <p className="element">Phone Number:</p>
                  <p className="data">{this.state.mdn}</p>
                </div>
                <div className="data-wrapper">
                  <p className="element">Country:</p>
                  <p className="data">{this.state.country}</p>
                </div>
                <div className="data-wrapper">
                  <p className="element">City:</p>
                  <p className="data">{this.state.city}</p>
                </div>
                <div className="data-wrapper">
                  <p className="element">Status:</p>
                  <p className="data">{this.state.type}</p>
                </div>
                {(()=>{
                  if (this.state.type === "Driver") {
                    return (
                      <div className="data-wrapper">
                        <p className="element">Available Seats:</p>
                        <p className="data">{this.state.seats}</p>
                      </div>
                    )
                  }
                })()}
              </div>
            )
          }
        })()}
        <div className="edit-button">
          <button onClick={(this.state.edit) ? this.saveHandler : this.toggleEdit}>{(this.state.edit) ? "Save" : "Edit"}</button>
        </div>
      </div>
    )
  }
}

//Export the ManageUsers component for use within App.jsx
module.exports = ManageUsers;