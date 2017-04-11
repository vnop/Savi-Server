module.exports = {
	cities: [
		{
			name: 'Paris',
			mainImage: 'paris_city.jpg',
			tours: [
				{
					description: 'See the outside and inside of the famous Eiffel Tower. Learn the ins and outs of this historical building, eat in the restaurant, and leave with an experience you\'ll never forget!',
					mainImage: 'paris_tour_eiffel-tower.jpg'
				},
				{
					description: 'Take a boat down the River Seine for a beautiful view of Paris right as the sun sets, then get dropped off just in time to visit some of the world\'s finest restaurants',
					mainImage: 'paris_tour_seine.jpg'
				},
				{
					description: 'For the foodie tourist, this guided walkthrough will introduce you to some of the finest places to eat in the heart of Paris. By the time the tour is over you will be ready to dine like royalty!',
					mainImage: 'paris_tour_restaurants'
				}
			]
		},
		{
			name: 'London',
			mainImage: 'london_city.jpg',
			tours: [
				{
					description: 'See London from a different perspective on the London Eye and enjoy the new 4D Experience, a groundbreaking 3D film with spectacular in-theater effects that include wind, bubbles, and mist. Fast-track admission is also available.',
					mainImage: 'london_tour_city.jpg'
				},
				{
					description: 'Visit London\s most iconic building, the clock tower Big Ben and get the inside scoop on its historical significance, how it was built, and more',
					mainImage: 'london_tour_big-ben.jpg'
				},
				{
					description: 'This guided tour of Buckingham Palace will give you insight like no other into the inner workings of the royal family\'s famous abode',
					mainImage: 'london_tour_buckingham-palace.jpg'
				}
			]
		},
		{
			name: 'Amsterdam',
			mainImage: 'amsterdam_city.jpg',
			tours: [
				{
					description: 'Enjoy a marvellous canal cruise in Amsterdam on board of a semi-open electric boat with zero emissions, and benefit from an audioguide in 19 different languages!',
					mainImage: 'amsterdam_tour_canal.jpg'
				},
				{
					description: 'Get an end-to-end tour of Amsterdam\'s greatest party spots. Come tour the night life during the day so you know where to go once the sun sets. These guides are experienced in having a great time!',
					mainImage: 'amsterdam_tour_night-life.jpg'
				},
				{
					description: '',
					mainImage: ''
				}
			]
		},
		// {
		// 	name: 'Rio de Janeiro',
		// 	mainImage: 'rio-de-janiero_city.jpg',
		// 	tours: [
		// 		{
		// 			description: 'See 2 of the most iconic sights of Rio de Janeiro on a 4-hour guided tour of Corcovado and the Selarón Steps. Add-on Sugar Loaf Mountain on a 6-hour tour, and see Rio from different perspectives. Marvel at Chilean artist Jorge Selarón’s ceramic art steps!',
		// 			mainImage: 'rio-de-janiero_tour_city.jpg'
		// 		},
		// 		{
		// 			description: '',
		// 			mainImage: ''
		// 		},
		// 		{
		// 			description: '',
		// 			mainImage: ''
		// 		}
		// 	]
		// },
		// {
		// 	name: 'Shanghai',
		// 	mainImage: 'shanghai_city.jpg',
		// 	tours: [
		// 		{
		// 			description: 'For tourists who only have a short layover in Shanghai, taking sightseeing bus to explore the beauty of the city undoubtedly is a good idea. In this way, visitors can squeeze limited time to tour around more must-sees during their one or two day(s) trip.',
		// 			mainImage: 'shanghai_tour_layover.jpg'
		// 		},
		// 		{
		// 			description: '',
		// 			mainImage: ''
		// 		},
		// 		{
		// 			description: '',
		// 			mainImage: ''
		// 		}
		// 	]
		// },
		// {
		// 	name: 'New York',
		// 	mainImage: 'new-york_city.jpg',
		// 	tours: [
		// 		{
		// 			description: 'The open-top Big Bus sightseeing tour is the most enjoyable and convenient way to see New York! You’ll see famous landmarks such as the iconic Empire State Building to the new One World Trade Center.',
		// 			mainImage: 'new-york_tour_bus.jpg'
		// 		},
		// 		{
		// 			description: '',
		// 			mainImage: ''
		// 		},
		// 		{
		// 			description: '',
		// 			mainImage: ''
		// 		}
		// 	]
		// }
	],

	languages: [
		'English',
		'Spanish',
		'French',
		'Italian',
		'Portuguese',
		'German',
		'Mandarin',
		'Japanese'
	],

	users: [
		{
			type: 'Driver',
			userName: 'Peter Melnick',
			userEmail: 'peter@gmail.com',
			mdn: '12323123',
			country: 'USA',
			photo: 'peter-melnick.jpg',
			city: 'New York',
			languages: ['English', 'French']
		},
		{
			type: 'Driver',
			userName: 'Elisa Bhandari',
			userEmail: 'marge@gmail.com',
			mdn: '54534323',
			country: 'USA',
			photo: 'elisa-bhandari.jpg',
			city: 'Rio de Janeiro',
			languages: ['Portuguese', 'English', 'French']
		},
		{
			type: 'Driver',
			userName: 'Serge Henry',
			userEmail: 'serge@gmail.com',
			mdn: '28288172',
			country: 'France',
			photo: 'serge-henry.jpg',
			city: 'Paris',
			languages: ['French', 'English', 'Italian']
		},
		{
			type: 'Tour Guide',
			userName: 'Franz Bauer',
			userEmail: 'franz@gmail.com',
			mdn: '2729384',
			country: 'Germany',
			photo: 'franz-bauer.jpg',
			city: 'London',
			languages: ['German', 'English', 'Spanish']
		},
		{
			type: 'Tour Guide',
			userName: 'Albert Hoffmann',
			userEmail: 'albert@gmail.com',
			mdn: '82738376',
			country: 'Netherlands',
			photo: 'albert-hoffmann.jpg',
			city: 'Amsterdam',
			languages: ['German', 'English']
		},
		{
			type: 'Tour Guide',
			userName: 'Xin Meng',
			userEmail: 'xin@gmail.com',
			mdn: '827374683',
			country: 'China',
			photo: 'http://news.xinhuanet.com/english/2015-09/17/CnybnyE005038_20150916_NYMFN0A002_11n.jpg',
			city: 'Shanghai',
			languages: ['Mandarin', 'Japanese']
		}
	]
}