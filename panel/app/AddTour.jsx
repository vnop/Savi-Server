import React from 'react';

class AddTour extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cityData: [],
      tourData: [],
      //form field states
      tourCity: '',
      tourName: '',
      tourImg: '',
      tourDesc: ''
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
    e.preventDefault();
    //TESTING LOGS
    console.log('City:', this.state.tourCity);
    console.log('Tour:', this.state.tourName);
    console.log('ImageURL:', this.state.tourImg);
    console.log('Description:', this.state.tourDesc);
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
    fetch('https://savi-travel.com:8082/api/cities', {mode: 'no-cors'})
      .then(resp => resp.json())
      .then(data => this.setState({cityData: data}))
      .catch(err => console.error(err));
    //get the current tour list
    fetch('https://savi-travel.com:8082/api/tours', {mode: 'no-cors'})
      .then(resp => resp.json())
      .then(data => this.setState({tourData: data}))
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            City:
            <select onChange={this.cityForm} value={this.state.tourCity}>
              {this.state.cityData.map((item, i) => {
                return (
                  <option key={i} value={item.id}>{item.name}</option>
                )
              })}
            </select>
          </label>

          <label>
            Tour:
            <input type="text" value={this.state.tourName} onChange={this.nameForm} />           
          </label>

          <label>
            Image:
            <input type="text" value={this.state.tourImg} onChange={this.imageForm} />           
          </label>

          <label>
            Description:
            <input type="text" value={this.state.tourDesc} onChange={this.descForm} />           
          </label>   

          <input type="submit" value="Add" />
        </form>

        <hr/>

        <h2>Available Tours</h2>

        <div>
          {this.state.cityData.map((item, i) => {
            return (
              <div key={i}>
              <h3>{item.name}</h3>
              {this.processData(this.state.tourData, 'cityId', item.id).map((item, i) => {
                return (
                  <div key={i}>
                    {item.title}
                  </div>
                )
              })}                
              </div>
            )
          })}                   
        </div>

      </div>
    )
  }
}

module.exports = AddTour;