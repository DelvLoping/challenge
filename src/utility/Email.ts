//import { Client } from 'node-mailjet';
import Client, { MailService } from '@sendgrid/mail';

export class Email {

  private client: MailService;
  
  constructor() {
    this.client = Client
    this.client.setApiKey(process.env.MJ_APIKEY??"");
    
    /*
    new Client({
      apiKey: process.env.MJ_APIKEY ||  '650c4a928026033d089089cc09e870f2',
      apiSecret: process.env.MJ_APISECRET || '69f7bdf5eaa69818892bb4e3828569cc'
    });*/
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
    /*
    ◊const request = await this.client
      .post("send", { 'version': 'v3.1' })
      .request({
        "Messages": [
          {
            "From": {
              "Email": process.env.MJ_EMAIL_FROM || 'kevin@nguni.fr',
              "Name": process.env.MJ_EMAIL_NAME || 'Kevin'
            },
            "To": [
              {
                "Email": to,
              }
            ],
            "Subject": title.toUpperCase() + " : Votre lien magique",
            "HTMLPart": `
<p>Bonjour,</p>
<p>Cliquez sur le lien afin de vous identifier. Le lien sera valable pendant 30 minutes.</p>
<p><a href=" + ${link} + ">Connexion</a>
<p>Si le lien dessus ne fonctionne pas, copiez/collez le lien suivant dans votre navigateur :</a>
<pre>${link}</pre>
`,
          }
        ]
      });
      */
  }

}