const stripe = require("stripe")(process.env.STRIPE_API_KEY);



const stripePayment = async (req, res) => {

    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        description: req.body.walletId,
        currency: "eur"
    });
    console.log(paymentIntent);
    res.send(paymentIntent);
};

module.exports= {
    stripePayment
}