module.exports = {
	cities: [
		{
			name: 'Paris',
			description: 'Skip the line to the Paris Catacombs and discover a darker side to the City of Lights. Descend beneath the streets of Paris and listen to the commentary from your informative audio guide, available in 4 languages.',
			mainImage: 'https://pbs.twimg.com/media/C4QNypEWEAQT32x.jpg'
		},
		{
			name: 'London',
			description: 'See London from a different perspective on the London Eye and enjoy the new 4D Experience, a groundbreaking 3D film with spectacular in-theater effects that include wind, bubbles, and mist. Fast-track admission is also available.',
			mainImage: 'https://media.timeout.com/images/100644443/image.jpg'
		},
		{
			name: 'Amsterdam',
			description: 'Enjoy a marvellous canal cruise in Amsterdam on board of a semi-open electric boat with zero emissions, and benefit from an audioguide in 19 different languages!',
			mainImage: 'https://triptravel.es/wp-content/uploads/2017/03/escapada_a_amsterdam_en_febrero_marzo_y_abril-reservas-hoteles_en_amsterdam-restaurantes_en_amsterdam-vacaciones_en_paises_bajos-lunas_de_miel_en_amsterdam-viajes_a_paises_bajos-vuelos_a_paises_bajos-1024x538.jpg'
		},
		{
			name: 'Rio de Janeiro',
			description: 'See 2 of the most iconic sights of Rio de Janeiro on a 4-hour guided tour of Corcovado and the Selarón Steps. Add-on Sugar Loaf Mountain on a 6-hour tour, and see Rio from different perspectives. Marvel at Chilean artist Jorge Selarón’s ceramic art steps!',
			mainImage: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS3n0PS3xp282FtZw0j9_Cd789HepQ0_ons1woN6tykGPUoS5GI'
		},
		{
			name: 'Shanghai',
			description: 'For tourists who only have a short layover in Shanghai, taking sightseeing bus to explore the beauty of the city undoubtedly is a good idea. In this way, visitors can squeeze limited time to tour around more must-sees during their one or two day(s) trip.',
			mainImage: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcROreloGGsSrsPROFFx2uX3ziyWnKGtcZ63ubREZS5By1v3BP6Y'
		},
		{
			name: 'New York',
			description: 'The open-top Big Bus sightseeing tour is the most enjoyable and convenient way to see New York! You’ll see famous landmarks such as the iconic Empire State Building to the new One World Trade Center.',
			mainImage: 'https://only-apartments.storage.googleapis.com/web/imgs/city/New-York_Small.jpg'
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
			mdn: '12323123',
			country: 'USA',
			photo: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRr-2ztovFQrCV_5GpReNfM6uv2q7RzbJQWWyMX9L3pq2FsfRJH',			
			city: 'New York',
			languages: ['English', 'French']
		},
		{
			type: 'Driver',
			userName: 'Elisa Bhandari',
			userEmail: 'marge@gmail.com',
			mdn: '54534323',
			country: 'USA',
			photo: 'https://qzprod.files.wordpress.com/2016/06/xxxx.jpg?quality=80&strip=all&w=1600',
			city: 'Rio de Janeiro',
			languages: ['Portuguese', 'English', 'French']
		},
		{
			type: 'Driver',
			userName: 'Serge Henry',
			userEmail: 'serge@gmail.com',
			mdn: '28288172',
			country: 'France',
			photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSczp-qWQc6aplGEBkTCs3i6E7FP0pMheYitx0c3OM0YbhCPiKqMg',
			city: 'Paris',
			languages: ['French', 'English', 'Italian']
		},
		{
			type: 'Tour Guide',
			userName: 'Franz Bauer',
			userEmail: 'franz@gmail.com',
			mdn: '2729384',
			country: 'Germany',
			photo: 'http://az616578.vo.msecnd.net/files/2015/10/09/635799543747153957-829668496_TOUR%20.jpg',
			city: 'London',
			languages: ['German', 'English', 'Spanish']
		},
		{
			type: 'Tour Guide',
			userName: 'Albert Hoffmann',
			userEmail: 'albert@gmail.com',
			mdn: '82738376',
			country: 'Netherlands',
			photo: 'https://engagingplaces.files.wordpress.com/2016/02/tour-guide-antwerp.jpg',
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