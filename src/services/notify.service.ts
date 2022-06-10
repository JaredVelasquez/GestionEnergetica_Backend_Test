import { /* inject, */ BindingScope, injectable} from '@loopback/core/dist';
var nodemailer = require('nodemailer');

@injectable({scope: BindingScope.TRANSIENT})
export class NotifyService {
  constructor() { }

  async EmailNotification(email: string, subject: string, content: string, atachment?: any) {
    let isSend: boolean = false;
    var transporter = nodemailer.createTransport({
      service: 'outlook',
      auth: {
        user: 'jared.vealsquez@outlook.com',
        pass: '123soleado'
      }
    });

    var mailOptions = {
      from: 'jared.vealsquez@outlook.com',
      to: `${email}`,
      subject: `${subject}`,
      text: `${content}`,
      attachments: [
        {
          path: atachment
        }]
    };

    await transporter.sendMail(mailOptions, function (error: any, info: any) {
      if (error) {
        console.log(error);
        isSend = false;
      } else {
        console.log('Email enviado: ' + info.response);
        isSend = true;
      }
    });

    return isSend;


  }

}
