import ssh from "ssh2";
import { IQuestion } from "../model/IQuestion";
import { IQuestionResponse } from "../types/IQuestionReponse";
import { IBdConnectionOptions } from "../types/IBdConnectionOptions";
import mysql from "mysql2";

/** Wrapper de la connexion ssh.
 * On stock des options de connexion, une reference de sshClient, et une liste de commandes à exécuter.
 */
export class SSH {

  private connectionOptions: ssh.ConnectConfig;
  private sshClient: ssh.Client;
  private questions: IQuestion[];
  private bdConnectionOptions?: IBdConnectionOptions;

  constructor(connectionOptions: ssh.ConnectConfig, bdConnectionOptions: IBdConnectionOptions | undefined) {
    this.connectionOptions = connectionOptions;
    this.sshClient = new ssh.Client();
    this.questions = [];
    if (bdConnectionOptions) {
      this.bdConnectionOptions = bdConnectionOptions;
    }
  }

  public async connect(): Promise<void> {
    return new Promise((resolve, reject) => {

      this.sshClient.on('ready', () => {
        console.log('Connection ssh réussie')
        resolve();
      }).on('error', (err) => {
        console.log('Erreur lors de la connexion ssh :', err);
        reject(err);
      }).connect(this.connectionOptions);
    });
  }

  public async execCommand(command: string, useBdd: boolean): Promise<string> {
    return new Promise((resolve, reject) => {
      if (useBdd) {
        console.log('useBdd : ', command);
        this.sshClient.forwardOut(
          'localhost', // Adresse locale
          0, // Port local (0 signifie que le port sera automatiquement attribué)
          'localhost', // Adresse distante (le serveur MySQL)
          3306, // Port distant (le port MySQL sur le serveur distant)
          (err, stream) => {
            if (err) {
              console.log(err);
              resolve(err.toString());
              return err.toString();
            }
            const mysqlConnection = mysql.createConnection({
              host: 'localhost', // Adresse locale
              port: 0, // Port local (sera automatiquement attribué)
              user: this.bdConnectionOptions?.bdUserServer,
              password: this.bdConnectionOptions?.bdPasswordServer,
              database: 'challenges',
              stream: stream // Utilisez le flux du tunnel SSH comme socket pour la connexion MySQL
            });
            console.log('mysqlConnection : ', mysqlConnection);

            try {
              mysqlConnection.connect((error: any) => {
                if (error) {
                  console.log('Erreur lors de la connexion MySQL :', error);
                  resolve(error.toString());
                  return error.toString();
                }

                mysqlConnection.query(command, (mysqlError: any, results: any, fields: any) => {
                  if (mysqlError) {
                    console.log('Erreur lors de l\'exécution de la commande MySQL :', mysqlError);
                    resolve(mysqlError);
                    return mysqlError;
                  }
                  let json = JSON.stringify(results)

                  console.log('result : ',typeof results,results,' res string : ', " json : ",json);
                  // Traitez les résultats MySQL ici
                  resolve(json);

                  mysqlConnection.end();
                  mysqlConnection.destroy();
                });
              });
            } catch (err: any) {
              console.log(err);
              resolve(err.toString());
              return err.toString();
            }
          }
        );

      } else {

        this.sshClient.exec(command, (err, stream) => {
          if (err) {
            //console.log(err);
            reject(err);
          }
          let result = '';
          stream.on('close', (code: any, signal: any) => {
            resolve(result);
          }).on('data', (data: any) => {
            result += data;
          }).stderr.on('data', (data) => {
            //console.log('STDERR: ' + data);
            result += data;
            //reject(data);
          });
        });
      }
    });
  }

  public async execCommands(): Promise<IQuestionResponse[]> {
    const results: IQuestionResponse[] = [];
    let countQuestion = 0;
    let test = true;
    while (countQuestion < this.questions.length && test) {
      let result: IQuestionResponse = { id: 0, value: '', success: false };
      const question = this.questions[countQuestion];
      result.id = question.questionId;
      try {
        result.value = await this.execCommand(question.cmd, question.useBdd ?? false);
      }
      catch (err: any) {
        result.value = err.toString();
      }
      if (result.value !== question.result) {
        test = false;
      }
      result.success = test;
      results.push(result);
      countQuestion++;
    }

    return results;
  }

  public addCommand(question: IQuestion): void {
    this.questions.push(question);
  }

  public async end(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.sshClient.on('close', () => {
        console.log('Connection ssh fermée')
        resolve()
      }).end();
    });
  }

  public setCommands(questions: IQuestion[]): void {
    this.questions = questions;
  }

  public getCommands(): IQuestion[] {
    return this.questions;
  }


}