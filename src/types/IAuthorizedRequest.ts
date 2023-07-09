import { Request } from "express";
import ssh from "ssh2";
import { IQuestionResponse } from "./IQuestionReponse";

export interface IAuthorizedRequest extends Request {
    userId?: number;
    profileCode?: number;
    resLastMiddleware?: any;
    sshClient?: ssh.Client;
    sshClientOptions?: ssh.ConnectConfig;
    resultsCommands?: IQuestionResponse[];
  }
  