const nodemailer = require("nodemailer");
const secure_confi = require(process.env.EMAIL_CONFIGURATION_PATH)

let transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        ...secure_confi
    }
})
async function sendWelcomeEmail(email, name) {
    let info = await transport.sendMail({
        from: secure_confi.user,
        to: email,
        subject: "welcome to our website",
        text: `wellcome ${name} to our service`
    })
    console.log("message sent ", info.messageId)
}

async function sendGoodbyeEmail(email, name) {
    let info = await transport.sendMail({
        from: secure_confi.user,
        to: email,
        subject: "sorry to see you go",
        text: `Goodbye tell us ${name} how can we improve our servece ? and we would like to have you back have a nice day`
    })
    console.log("message sent ", info.messageId)
}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail
}