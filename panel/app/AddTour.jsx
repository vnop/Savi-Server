import React from 'react';
import config from '../../config/config.js';
class AddTour extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cityData: [],
      tourData: [],
      //form field states
      tourCity: 0, //id of the selected city
      tourName: '', //name of the tour attraction
      tourImg: '', //url of the image to be stored
      tourDesc: '' //description of the tour
    }

    //METHOD BINDINGS
    this.nameForm = this.nameForm.bind(this);
    this.imageForm = this.imageForm.bind(this);
    this.descForm = this.descForm.bind(this);
    this.cityForm = this.cityForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.processData = this.processData.bind(this);
  }

  //FORM CONTROLS
  cityForm(e) {this.setState({ tourCity: e.target.value })}
  nameForm(e) {this.setState({ tourName: e.target.value })}
  imageForm(e) {this.setState({ tourImg: e.target.value })}
  descForm(e) {this.setState({ tourDesc: e.target.value })}

  //handle the event of submitting form data
  handleSubmit(e) {
    e.preventDefault();//stops page refresh on submit

    let exists = this.state.tourData.filter((obj)=>{
      return obj.title.toLowerCase() === this.state.tourName.toLowerCase();
    }).length>0;

    if (exists) { //if the tour already exists...

    } else { //otherwise...
      //POST REQUEST
      fetch('https://savi-travel.com:'+config.port+'/api/tours', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: this.state.tourName,
          mainImage: this.state.tourImg,
          description: this.state.tourDesc,
          cityId: this.state.tourCity
        })
      });
      this.state.tourData.push({
        title: this.state.tourName,
        mainImage: this.state.tourName.replace(' ', '-').toLowerCase()+'_tour.jpg',
        description: this.state.tourDesc,
        cityId: this.state.tourCity
      });
      this.setState({ //reset forms
        tourCity: 0,
        tourName: '',
        tourImg: '',
        tourDesc: ''
      });
    }
  }

  //To filter the tourData array for a desired city value
  processData(array, key, val) { //takes and array, a key (as string), and value
    return array.filter((obj) => {
      return obj[key] === val;
    });
  }

  //INITIAL DATA FETCH
  componentWillMount() {
    //get the current city list
    fetch('https://savi-travel.com:'+config.port+'/api/cities')
      .then(resp => resp.json())
      .then(data => this.setState({cityData: data}))
      .catch(err => console.error(err));
    //get the current tour list
    fetch('https://savi-travel.com:'+config.port+'/api/tours')
      .then(resp => resp.json())
      .then(data => this.setState({tourData: data}))
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div className="add-tours-component">
        <div className="form-wrapper">
          <h3>Add New City</h3>
          <form className="centered-form" onSubmit={this.handleSubmit}>
            <select onChange={this.cityForm} value={this.state.tourCity}>
              {this.state.cityData.map((item, i) => {
                return (
                  <option key={i} value={item.id}>{item.name}</option>
                )
              })}
            </select>
            <div className="input-wrapper">
              <label>Tour Name</label>
              <input type="text" value={this.state.tourName} onChange={this.nameForm} />
            </div>

            <div className="input-wrapper">
              <label>Image</label>
              <input type="text" value={this.state.tourImg} onChange={this.imageForm} />
            </div>

            <div className="input-wrapper">
              <label>Description</label>
              <input type="text" value={this.state.tourDesc} onChange={this.descForm} />
            </div>

            <input type="submit" value="Add" />
          </form>
        </div>
        <div className="available-records">
          <h2>Available Tours</h2>
          {this.state.cityData.map((item, i) => {
            return (
              <div className="record-container" key={i}>
                <p className="record-name">{item.title}</p>
                <div>
                  {this.processData(this.state.tourData, "cityId", item.id).map((item, i) => {
                    return (
                      <div key={i}>
                        <p>{item.title}</p>
                        <div className="image-wrapper">
                          <img className="record-images" src={"https://savi-travel.com:"+config.port+"/api/images/"+item.mainImage} />
                        </div>
                        <div className="record-description">{item.description}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

module.exports = AddTour;