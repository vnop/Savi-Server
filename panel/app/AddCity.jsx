import React from 'react';

class AddCity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      cityName: '',
      cityImg: ''
    };

    this.nameForm = this.nameForm.bind(this);
    this.imageForm = this.imageForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  nameForm(e) {
    this.setState({ cityName: e.target.value });
  }

  imageForm(e) {
    this.setState({ cityImg: e.target.value });
  }

  handleSubmit(e) {
    console.log('Data:', this.state);
    e.preventDefault();
  }

  //INITIAL DATA FETCH
  componentWillMount() {
    fetch('https://savi-travel.com:8082/api/cities', {mode: 'no-cors'})
      .then(resp => resp.json())
      .then(data => this.setState({data}))
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            City:
            <input type="text" value={this.state.cityName} onChange={this.nameForm} />           
          </label>
          <label>
            Image:
            <input type="text" value={this.state.cityImg} onChange={this.imageForm} />           
          </label>
          <input type="submit" value="Add" />
        </form>

        <hr/>

        <h2>Available Cities</h2>
        <div>
          {this.state.data.map((item, i) => {
            return (
              <div key={i}>
                {item.name}
                <img id="cityImgs" src={"https://savi-travel.com:8080/api/images/"+item.mainImage} />
              </div>
            )
          })}
        </div>

      </div>
    )
  }
}

module.exports = AddCity;

//sample data
var sample = []
//   {
//     "id": 1,
//     "name": "Paris",
//     "mainImage": "paris_city.jpg"
//   },
//   {
//     "id": 2,
//     "name": "London",
//     "mainImage": "london_city.jpg"
//   },
//   {
//     "id": 3,
//     "name": "Amsterdam",
//     "mainImage": "amsterdam_city.jpg"
//   },
//   {
//     "id": 4,
//     "name": "Rio de Janeiro",
//     "mainImage": "rio-de-janiero_city.jpg"
//   },
//   {
//     "id": 5,
//     "name": "Shanghai",
//     "mainImage": "shanghai_city.jpg"
//   },
//   {
//     "id": 6,
//     "name": "New York",
//     "mainImage": "new-york_city.jpg"
//   }
// ]