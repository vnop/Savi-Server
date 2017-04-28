const helpers = require('../helpers');
const stripe = require('stripe')('sk_test_t33bUz9G1cD2X6UexENeMvpd');
//
module.exports = function(app, db) {

  app.post('/payments', function(req, res){
    console.log('payment request..', req.body)
    var token = req.body.stripeToken; // Using Express
    var totalAmount = parseFloat(req.body.totalAmount) * 100

    // Create a Customer:
    // stripe.customers.create({
    //   email: "paying.user@example.com",
    //   source: token,
    // }).then(function(customer) {
      // // YOUR CODE: Save the customer ID and other info in a database for later.
    //   return stripe.charges.create({
    //     amount: 1000,
    //     currency: "usd",
    //     customer: customer.id,
    //   });
    // }).then(function(charge) {
      // // Use and save the charge info.
    // });

    //Charge the user's card:
    var charge = stripe.charges.create({
      amount: totalAmount,
      currency: "usd",
      description: "savi test realAmount charges",
      source: token,
    }, function(err, charge) {
      if(err) {
        console.log(err);
        res.send('Failed')
      } else {
        console.log('success savi payment', charge);
          res.send(charge)
      }
    });
  });
}