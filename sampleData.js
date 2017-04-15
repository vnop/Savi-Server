module.exports = {
	cities: [
		{
			name: 'Paris',
			mainImage: 'paris_city.jpg'
		},
		{
			name: 'London',
			mainImage: 'london_city.jpg'
		},
		{
			name: 'Amsterdam',
			mainImage: 'amsterdam_city.jpg'
		},
		{
			name: 'Rio de Janeiro',
			mainImage: 'rio-de-janiero_city.jpg'
		},
		{
			name: 'Shanghai',
			mainImage: 'shanghai_city.jpg'
		},
		{
			name: 'New York',
			mainImage: 'new-york_city.jpg'
		}
	],

	tours: [
		{
			city: 'Paris',
			title: 'Eiffel Tower',
			description: 'See the outside and inside of the famous Eiffel Tower. Learn the ins and outs of this historical building, eat in the restaurant, and leave with an experience you\'ll never forget!',
			mainImage: 'paris_tour_eiffel-tower.jpg'
		},
		{
			city: 'Paris',
			title: 'The Riever Seine',
			description: 'Take a boat down the River Seine for a beautiful view of Paris right as the sun sets, then get dropped off just in time to visit some of the world\'s finest restaurants',
			mainImage: 'paris_tour_seine.jpg'
		},
		{
			city: 'Paris',
			title: 'Restaurant Scene',
			description: 'For the foodie tourist, this guided walkthrough will introduce you to some of the finest places to eat in the heart of Paris. By the time the tour is over you will be ready to dine like royalty!',
			mainImage: 'paris_tour_restaurants.jpg'
		},
		{
			city: 'London',
			title: 'See the City',
			description: 'See London from a different perspective on the London Eye and enjoy the new 4D Experience, a groundbreaking 3D film with spectacular in-theater effects that include wind, bubbles, and mist. Fast-track admission is also available.',
			mainImage: 'london_tour_city.jpg'
		},
		{
			city: 'London',
			title: 'Big Ben',
			description: 'Visit London\s most iconic building, the clock tower Big Ben and get the inside scoop on its historical significance, how it was built, and more',
			mainImage: 'london_tour_big-ben.jpg'
		},
		{
			city: 'London',
			title: 'Buckingham Palace',
			description: 'This guided tour of Buckingham Palace will give you insight like no other into the inner workings of the royal family\'s famous abode',
			mainImage: 'london_tour_buckingham-palace.jpg'
		},
		{
			city: 'Amsterdam',
			title: 'Canal Boat Tour',
			description: 'Enjoy a marvellous canal cruise in Amsterdam on board of a semi-open electric boat with zero emissions, and benefit from an audioguide in 19 different languages!',
			mainImage: 'amsterdam_tour_canal.jpg'
		},
		{
			city: 'Amsterdam',
			title: 'Amsterdam Night Life',
			description: 'Get an end-to-end tour of Amsterdam\'s greatest party spots. Come tour the night life during the day so you know where to go once the sun sets. These guides are experienced in having a great time!',
			mainImage: 'amsterdam_tour_night-life.jpg'
		},
		{
			city: 'Rio de Janeiro',
			title: 'Rio de Janeiro Highlights',
			description: 'See 2 of the most iconic sights of Rio de Janeiro on a 4-hour guided tour of Corcovado and the Selarón Steps. Add-on Sugar Loaf Mountain on a 6-hour tour, and see Rio from different perspectives. Marvel at Chilean artist Jorge Selarón’s ceramic art steps!',
			mainImage: 'rio-de-janiero_tour_city.jpg'
		},
		{
			city: 'Shanghai',
			title: 'Shanghai in a Hurry',
			description: 'For tourists who only have a short layover in Shanghai, taking sightseeing bus to explore the beauty of the city undoubtedly is a good idea. In this way, visitors can squeeze limited time to tour around more must-sees during their one or two day(s) trip.',
			mainImage: 'shanghai_tour_layover.jpg'
		},
		{
			city: 'New York',
			title: 'NYC Bus Tour',
			description: 'The open-top Big Bus sightseeing tour is the most enjoyable and convenient way to see New York! You’ll see famous landmarks such as the iconic Empire State Building to the new One World Trade Center.',
			mainImage: 'new-york_tour_bus.jpg'
		}
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
			mdn: '202-555-0173',
			country: 'USA',
			photo: 'peter-melnick.jpg',
			city: 'New York',
			languages: ['English', 'French']
		},
		{
			type: 'Driver',
			userName: 'Elisa Bhandari',
			userEmail: 'marge@gmail.com',
			mdn: '202-555-0174',
			country: 'USA',
			photo: 'elisa-bhandari.jpg',
			city: 'Rio de Janeiro',
			languages: ['Portuguese', 'English', 'French']
		},
		{
			type: 'Driver',
			userName: 'Serge Henry',
			userEmail: 'serge@gmail.com',
			mdn: '202-555-0175',
			country: 'France',
			photo: 'serge-henry.jpg',
			city: 'Paris',
			languages: ['French', 'English', 'Italian']
		},
		{
			type: 'Driver',
			userName: 'Huge Jacked-Man',
			userEmail: 'wolverine@xavier.edu',
			mdn: '202-555-0176',
			country: 'Australia',
			photo: 'huge-jacked-man.jpg',
			city: 'Amsterdam',
			languages: ['English', 'Mandarin']
		},
		{
			type: 'Driver',
			userName: 'Buffalo Custardbath',
			userEmail: 'sherlock@holmes.net',
			mdn: '202-555-0177',
			country: 'United Kingdom',
			photo: 'benedict-cumberbatch.jpg',
			city: 'London',
			languages: ['English']
		},
		{
			type: 'Driver',
			userName: 'Nicolas Cage',
			userEmail: 'wickerman123@aol.com',
			mdn: '202-555-0178',
			country: 'USA',
			photo: 'nicolas-cage.jpg',
			city: 'Shanghai',
			languages: ['German', 'Mandarin', 'English']
		},
		{
			type: 'Tour Guide',
			userName: 'Franz Bauer',
			userEmail: 'franz@gmail.com',
			mdn: '202-555-0179',
			country: 'Germany',
			photo: 'franz-bauer.jpg',
			city: 'London',
			languages: ['German', 'English', 'Spanish']
		},
		{
			type: 'Tour Guide',
			userName: 'Albert Hoffmann',
			userEmail: 'albert@gmail.com',
			mdn: '202-555-0170',
			country: 'Netherlands',
			photo: 'albert-hoffmann.jpg',
			city: 'Amsterdam',
			languages: ['German', 'English']
		},
		{
			type: 'Tour Guide',
			userName: 'Xin Meng',
			userEmail: 'xin@gmail.com',
			mdn: '202-555-0171',
			country: 'China',
			photo: 'xin-meng.jpg',
			city: 'Shanghai',
			languages: ['Mandarin', 'Japanese']
		},
		{
			type: 'Tour Guide',
			userName: 'John Constantine',
			userEmail: 'johnconstantine@asshole.net',
			mdn: '202-555-0172',
			country: 'USA',
			photo: 'keanu-reeves.jpg',
			city: 'New York',
			languages: ['English']
		},
		{
			type: 'Tour Guide',
			userName: 'Dwayne Johnson',
			userEmail: 'therock@muscles.org',
			mdn: '202-555-0180',
			country: 'USA',
			photo: 'dwayne-johnson.jpg',
			city: 'Rio de Janeiro',
			languages: ['English', 'Spanish']
		},
		{
			type: 'Tour Guide',
			userName: 'Daisy Johnson',
			userEmail: 'quake@inhuman.biz',
			mdn: '202-555-0181',
			country: 'USA',
			photo: 'daisy-johnson.jpg',
			city: 'Paris',
			languages: ['English', 'Spanish', 'French', 'Italian', 'Portuguese']
		}
	]
}