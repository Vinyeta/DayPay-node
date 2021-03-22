const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = (user) => {
    const msg = {
        to: user.email, // Change to your recipient
        from: "avinetam@gmail.com", // Change to your verified sender
        subject: "Welcome to DayPay",
        text: `Welcome to DayPay ${user.name} ${user.surname}, start sending money to your acquaintance instantly!`,
        html: `<strong>Welcome to DayPay ${user.name} ${user.surname}, start sending money to your acquaintance instantly!</strong>`,
    };
    sgMail
        .send(msg)
        .then(() => {
            console.log("Email sent");
        })
        .catch((error) => {
            console.error(error);
        });
}

module.exports = sendEmail;