const nodemailer = require("nodemailer");

exports.mailSender  = async(email, subject,body)=>{
    try {
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:({
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            })


        })
            let  info = await transporter.sendMail({
                        from:"Shopfinity",
                        to:email,
                        subject:subject,
                        html:body,

            })
        
          return  info;
    } catch (error) {
        console.log("Something went wrong when snding email",error);
 
    }
}