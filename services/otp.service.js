const nodemailer = require("nodemailer")
const accountSid = "AC458a9fbff77ddf77e1940a60e18663dd";
const authToken = "ccd5fb47ca2475d3fbaf1e8fda19112f";
const client = require('twilio')(accountSid, authToken);

function sendOTP(otp, to='+917003853731'){
    client.messages.create({
             body: `your verification otp: ${otp}`,
             from: '+13254139826',
             to: '+917003853731'
         })
         .then(message => console.log(message.sid))
         .catch(err=>{
              console.log(err.message)
         })
}

function mailOTP(otp, email){

    let transport = nodemailer.createTransport({
        service:"gmail", 
        auth:{
            user:process.env.EMAIL,
            pass:process.env.PASSWORD
        }
    })

    let mailOptions =  {
        from:process.env.EMAIL,
        to:email,
        subject:"Verification One Time Password",
        text:`Hi, your OTP is ${otp}`
    }
    eydR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjUzMjg3OTI3LCJleHAiOjE2NTMzNzQzMjd9.NlZDa90NJCeJ040v_iPz5ZBEHsDwlCw6RxKa2gQRgk0
    transport.sendMail(mailOptions, (err, info)=>{
        if(err){
            console.log(err)
            res.send("error")
        }else{
            console.log("sent "+info.response)
        }
    })


}

module.exports = {
    sendOTP, mailOTP
}

