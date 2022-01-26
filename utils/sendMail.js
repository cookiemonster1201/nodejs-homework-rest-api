const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const {SENDGRID_API_KEY, EMAIL} = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);

async function sendMail(data) {
    try {
        const email = {...data, from: `"Alona Mykytiuk" <${EMAIL}>`}
        await sgMail.send(email);
    } catch (error) {
        throw new Error(error)
    }
}


module.exports = sendMail;