module.exports = {
	newBooking: {
		subject: 'You have a tour booked! ✔',
		content: function(name, tourName, date) {
			return  '<h1>Hello '+ name +'</h1>' +
							'<h3>You have the '+ tourName +' tour booked</h3>' +
							'<h2>The date of the tour is '+ date +'</h2>' +
							'<h2>Enjoy the experience!</h2>'
		}
	},

	'Tour Guide': {
		subject: 'You have a new tour booked! ✔',
		content: function(name, tourName, date) {
			return  '<h1>Dear Tour Guide '+ name +'</h1>' +
							'<h3>You have the '+ tourName +' tour booked</h3>' +
							'<h2>The date of the tour is '+ date +'</h2>' +
							'<h2>Enjoy the experience!</h2>'
		}
	},

	'Driver': {
		subject: 'You have a new tour booked! ✔',
		content: function(name, tourName, date) {
			return  '<h1>Dear Driver '+ name +'</h1>' +
							'<h3>You have the '+ tourName +' tour booked</h3>' +
							'<h2>The date of the tour is '+ date +'</h2>' +
							'<h2>Enjoy the experience!</h2>'
		}
	}
	'Tourist': {
		subject: 'You have a new tour booked! ✔',
		content: function(name, tourName, date) {
			return  '<h1>Dear Customer '+ name +'</h1>' +
							'<h3>You have the '+ tourName +' tour booked</h3>' +
							'<h2>The date of the tour is '+ date +'</h2>' +
							'<h2>Enjoy the experience!</h2>'
	}
}

