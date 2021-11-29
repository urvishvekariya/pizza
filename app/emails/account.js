const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {

    sgMail.send({
        to: email,
        from: 'urvish.adsum@gmail.com',
        subject: 'Thanks for joining in !',
        text: `Welcome to the Skyline pizza app, ${name}. Let me know how you get along with the Skyline pizza. Enjoy your food with us!`
    }).then(() => {
    }).catch((err) => {
        console.log(err)
    })
}

const sendGoodbyeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'urvish.adsum@gmail.com',
        subject: 'Goodbye, Visit again !',
        text: `Goodbye, ${name}.We hope that you have a nice experience. If you okay with replay then tell us your experiance with the app.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail
}