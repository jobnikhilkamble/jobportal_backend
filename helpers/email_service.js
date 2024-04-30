const nodemailer = require('nodemailer')

exports.send_email = async (email,emailOTP) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'raisingbroadband@gmail.com',
          pass: 'dravid19'
        }
    });
      
    var mailOptions = {
        from: 'raisingbroadband@gmail.com',
        to: email,
        subject: 'Email Verification for Job Portal',
        text: `OTP for Email Verification is` + emailOTP
    };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } 
        else {
            console.log('Email sent: ' + info.response);
        }
    });
}