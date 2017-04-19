import React from 'react';

class AddTour extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cityData: [],
      tourData: [],
      tourName: '',
      tourImg: '',
      tourDesc: ''
    }

    this.nameForm = this.nameForm.bind(this);
    this.imageForm = this.imageForm.bind(this);
    this.descForm = this.descForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.processData = this.processData.bind(this);
  }

  nameForm(e) {
    this.setState({ tourName: e.target.value });
  }

  imageForm(e) {
    this.setState({ tourImg: e.target.value });
  }

  descForm(e) {
    this.setState({ tourDesc: e.target.value });
  }

  handleSubmit(e) {
    console.log('Data:', this.state);
    e.preventDefault();
  }

  processData(array, key, val) { //takes and array, a key (as string), and value
    return array.filter((obj)=>{
      return obj[key] === val;
    });
  } 

  //INITIAL DATA FETCH
  componentWillMount() {
    fetch('https://savi-travel.com:8082/api/cities', {mode: 'no-cors'})
      .then(resp => resp.json())
      .then(data => this.setState({cityData: data}))
      .catch(err => console.error(err));

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

        <h2>Available Tours for this City</h2>

        <div>           
        </div>

      </div>
    )
  }
}
/*
<div>{this.processData(this.state.tourData).map(item, i) => {
  <div key={i}>
    <div>{item.title}</div>
  </div>
}}</div>
<img id="tourImgs" src={"https://savi-travel.com:8080/api/images/"+item.mainImage} />
module.exports = AddTour;
*/

const sample = [
  {
    "id": 1,
    "title": "Eiffel Tower",
    "description": "See the outside and inside of the famous Eiffel Tower. Learn the ins and outs of this historical building, eat in the restaurant, and leave with an experience you'll never forget!",
    "mainImage": "paris_tour_eiffel-tower.jpg",
    "createdAt": "2017-04-13T15:10:10.000Z",
    "updatedAt": "2017-04-13T15:10:10.000Z",
    "cityId": 1
  },
  {
    "id": 2,
    "title": "The Riever Seine",
    "description": "Take a boat down the River Seine for a beautiful view of Paris right as the sun sets, then get dropped off just in time to visit some of the world's finest restaurants",
    "mainImage": "paris_tour_seine.jpg",
    "createdAt": "2017-04-13T15:10:10.000Z",
    "updatedAt": "2017-04-13T15:10:10.000Z",
    "cityId": 1
  },
  {
    "id": 3,
    "title": "Big Ben",
    "description": "Visit Londons most iconic building, the clock tower Big Ben and get the inside scoop on its historical significance, how it was built, and more",
    "mainImage": "london_tour_big-ben.jpg",
    "createdAt": "2017-04-13T15:10:10.000Z",
    "updatedAt": "2017-04-13T15:10:10.000Z",
    "cityId": 2
  },
  {
    "id": 4,
    "title": "Buckingham Palace",
    "description": "This guided tour of Buckingham Palace will give you insight like no other into the inner workings of the royal family's famous abode",
    "mainImage": "london_tour_buckingham-palace.jpg",
    "createdAt": "2017-04-13T15:10:10.000Z",
    "updatedAt": "2017-04-13T15:10:10.000Z",
    "cityId": 2
  },
  {
    "id": 5,
    "title": "Restaurant Scene",
    "description": "For the foodie tourist, this guided walkthrough will introduce you to some of the finest places to eat in the heart of Paris. By the time the tour is over you will be ready to dine like royalty!",
    "mainImage": "paris_tour_restaurants.jpg",
    "createdAt": "2017-04-13T15:10:10.000Z",
    "updatedAt": "2017-04-13T15:10:10.000Z",
    "cityId": 1
  },
  {
    "id": 6,
    "title": "See the City",
    "description": "See London from a different perspective on the London Eye and enjoy the new 4D Experience, a groundbreaking 3D film with spectacular in-theater effects that include wind, bubbles, and mist. Fast-track admission is also available.",
    "mainImage": "london_tour_city.jpg",
    "createdAt": "2017-04-13T15:10:10.000Z",
    "updatedAt": "2017-04-13T15:10:10.000Z",
    "cityId": 2
  },
  {
    "id": 7,
    "title": "Canal Boat Tour",
    "description": "Enjoy a marvellous canal cruise in Amsterdam on board of a semi-open electric boat with zero emissions, and benefit from an audioguide in 19 different languages!",
    "mainImage": "amsterdam_tour_canal.jpg",
    "createdAt": "2017-04-13T15:10:10.000Z",
    "updatedAt": "2017-04-13T15:10:10.000Z",
    "cityId": 3
  },
  {
    "id": 8,
    "title": "Amsterdam Night Life",
    "description": "Get an end-to-end tour of Amsterdam's greatest party spots. Come tour the night life during the day so you know where to go once the sun sets. These guides are experienced in having a great time!",
    "mainImage": "amsterdam_tour_night-life.jpg",
    "createdAt": "2017-04-13T15:10:10.000Z",
    "updatedAt": "2017-04-13T15:10:10.000Z",
    "cityId": 3
  },
  {
    "id": 9,
    "title": "Rio de Janeiro Highlights",
    "description": "See 2 of the most iconic sights of Rio de Janeiro on a 4-hour guided tour of Corcovado and the Selarón Steps. Add-on Sugar Loaf Mountain on a 6-hour tour, and see Rio from different perspectives. Marvel at Chilean artist Jorge Selarón’s ceramic art steps!",
    "mainImage": "rio-de-janiero_tour_city.jpg",
    "createdAt": "2017-04-13T15:10:10.000Z",
    "updatedAt": "2017-04-13T15:10:10.000Z",
    "cityId": 4
  },
  {
    "id": 10,
    "title": "Shanghai in a Hurry",
    "description": "For tourists who only have a short layover in Shanghai, taking sightseeing bus to explore the beauty of the city undoubtedly is a good idea. In this way, visitors can squeeze limited time to tour around more must-sees during their one or two day(s) trip.",
    "mainImage": "shanghai_tour_layover.jpg",
    "createdAt": "2017-04-13T15:10:10.000Z",
    "updatedAt": "2017-04-13T15:10:10.000Z",
    "cityId": 5
  },
  {
    "id": 11,
    "title": "NYC Bus Tour",
    "description": "The open-top Big Bus sightseeing tour is the most enjoyable and convenient way to see New York! You’ll see famous landmarks such as the iconic Empire State Building to the new One World Trade Center.",
    "mainImage": "new-york_tour_bus.jpg",
    "createdAt": "2017-04-13T15:10:10.000Z",
    "updatedAt": "2017-04-13T15:10:10.000Z",
    "cityId": 6
  }
]