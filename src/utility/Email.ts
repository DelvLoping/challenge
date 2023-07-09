//import { Client } from 'node-mailjet';
import Client, { MailService } from '@sendgrid/mail';

export class Email {

  private client: MailService;
  
  constructor() {
    this.client = Client
    this.client.setApiKey(process.env.MJ_APIKEY??"");
    
  
  }

  async sendMagicLink(to: string, link: string, title: string) {
    console.info('Sending magic link to: ' + to);
    const msg = {
      to: to, // Change to your recipient
      from: {
        name: 'Challenge',
        email: 'f_delobe@hetic.eu',
      }, // Change to your verified sender
      subject: title.toUpperCase() + " : Votre lien magique",
      text: 'and easy to do anywhere, even with Node.js',
      html: `
      <p>Bonjour,</p>
      <p>Cliquez sur le lien afin de vous identifier. Le lien sera valable pendant 30 minutes.</p>
      <p><a href=" + ${link} + ">Connexion</a>
      <p>Si le lien dessus ne fonctionne pas, copiez/collez le lien suivant dans votre navigateur :</a>
      <pre>${link}</pre>
      `,
    }
    this.client.send(msg)
    .then((response:any) => {
      console.log(response[0].statusCode)
      console.log(response[0].headers)
    })
    .catch((error:any) => {
      console.error(error)
    })
  }

}