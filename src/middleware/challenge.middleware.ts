import {  Response, NextFunction } from "express";
import { Crud } from "../utility/Crud";

import { IAuthorizedRequest } from "../types/IAuthorizedRequest";
import { ITest } from "../model/ITest";
import { ITestPromoUser } from "../model/ITestPromoUser";
import { IIndexResponse, IReadWhere } from "../types/IIndexQuery";
import { IPromo } from "../model/IPromo";
import { ITestPromo } from "../model/ITestPromo";
import { IQuestion } from "../model/IQuestion";
import {  IReponseCreate } from "../model/IReponse";
import path from "path";
import fs from "fs";
import { ApiError } from "../utility/Error/ApiError";
import { ErrorCode } from "../utility/Error/ErrorCode";
import { SSH } from "../utility/SSH";
import { IQuestionResponse } from "../types/IQuestionReponse";
import { ITestPromoUserApi } from "../types/ITestPromoUserApi";
import { ITestApi } from "../types/ITestApi";
import { IBdConnectionOptions } from "../types/IBdConnectionOptions";
/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns le challenge de l'utilisateur connecté pour le test et la promo passés dans l'URL. Si l'utilisateur n'a pas de challenge pour ce test et cette promo, retourne null. Si il n'y a pas de test ou de promo correspondant, retourne une erreur 404.
 */
export const getChallengeMiddleware = async (req: IAuthorizedRequest, res: Response, next: NextFunction) => {
    try {
        const { testName, promoName } = req.params;
        const userId = req.userId;
        const profileCode = req.profileCode;

        let res: ITestPromoUserApi | null = null;
        let where: IReadWhere | null = null;
        let test: ITestApi | null = null;
        let promo: IPromo | null = null;
        let questions: IIndexResponse<IQuestion> | null = null;

        if (testName) {
            try {
                test = await Crud.Read<ITest>({
                    table: 'test',
                    columns: ["*"],
                    key: 'testName',
                    value: testName
                })
            } catch (error) {
                console.log(error);
                next(error);
            }
        }

        if (test?.testId) {
            try {
                questions = await Crud.Index<IQuestion>({
                    table: 'question',
                    columns: ["*"],
                    where: { testId: test.testId }
                })

                test.questions = questions.rows;
            } catch (error) {
                console.log(error);
                test.questions = [];
            }
        }

        if (promoName) {
            try {
                promo = await Crud.Read<IPromo>({
                    table: 'promo',
                    columns: ["*"],
                    key: 'promoName',
                    value: promoName
                })
            } catch (error) {
                console.log(error);
                next(error);
            }

        }

        if (test?.testId && promo?.promoId) {
            where = {}
            where.testId = test.testId;
            where.promoId = promo.promoId;
            try {
                let testPromo = await Crud.Read<ITestPromo>({
                    table: 'test_promo',
                    columns: ["*"],
                    where
                })

                if (testPromo?.testPromoId && userId) {
                    where = {}
                    where.testPromoId = testPromo.testPromoId;
                    where.userId = userId;
                    try {
                        let testPromoUser = await Crud.Read<ITestPromoUser>({
                            table: 'test_promo_user',
                            columns: ["*"],
                            where
                        })

                        if (testPromoUser?.testPromoUserId) {
                            res = testPromoUser;
                            res.test = test;
                            res.promo = promo;
                        }
                    } catch (error) {
                        console.log(error);
                        res = null;
                    }
                }
            } catch (error) {
                console.log(error);
                next(error);
            }

        }

        req.resLastMiddleware = res;
        next();
    } catch (error) {
        next(error);
    }
}

/**
 * 
 * @param req
 * @param res
 * @param next
 * @returns supprime les réponses de l'utilisateur connecté pour le test et la promo passés dans l'URL. Si l'utilisateur n'a pas de challenge pour ce test et cette promo, retourne null. Si il n'y a pas de test ou de promo correspondant, retourne une erreur 404.
 * /!\ A utiliser après le middleware getChallengeMiddleware
 **/
export const clearResponseMiddleware = async (req: IAuthorizedRequest, res: Response, next: NextFunction) => {
    try {
        const res: ITestPromoUserApi | null = req.resLastMiddleware;
        let where: IReadWhere | null = null;
        if (res) {
            where = {}
            where.testPromoUserId = res.testPromoUserId;
            await Crud.Delete({
                table: 'reponse',
                where
            });
        }
        next();
    } catch (error) {
        next(error);
    }
}

export const connecteSshMiddleware = async (req: IAuthorizedRequest, res: Response, next: NextFunction) => {
    try {
        const res: ITestPromoUserApi | null = req.resLastMiddleware;
        if (res) {
            const idRsaPath = path.join(process.cwd(), '.ssh', 'id_rsa');
            const connectionOptions = {
                host: res.urlServer,
                port: 22,
                username: res.userServer,
                password: res.passwordServer, 
                privateKey: fs.readFileSync(idRsaPath)
            };
            let bdConnectionOptions:IBdConnectionOptions|undefined=undefined
            if(res.bdUserServer && res.bdPasswordServer)
            {
            bdConnectionOptions = {
                bdUserServer:res.bdUserServer,
                bdPasswordServer:res.bdPasswordServer
            }
        }
            const sshClient:SSH= new SSH(connectionOptions,bdConnectionOptions);

            const bdUserServer:string | undefined = res.bdUserServer??'';
            const bdPasswordServer:string| undefined = res.bdPasswordServer??'';

            
            
            
            if(res.test?.questions)
            {
                let questions = res.test?.questions?.map((question:IQuestion)=>{
                    if(question.useBdd){
                        let res = question.cmd
                        res = res.replace('{{bdUserServer}}', bdUserServer).replace('{{bdPasswordServer}}', bdPasswordServer);
                        question.cmd = res;
                    }
                    return question;
                });
                res.test.questions = questions;
                sshClient.setCommands(res.test?.questions);
            }
                
            try {
                await sshClient.connect();
                let resultCommands: IQuestionResponse[] = await sshClient.execCommands();
                await sshClient.end();
                req.resultsCommands = resultCommands;
            } catch (error) {
                console.log(error);
                throw new ApiError(ErrorCode.InternalError, 'ssh/failed', `Connection ssh failed, could not connect to ${res.urlServer}`);
            }
        }
        next();

    } catch (error) {
        next(error);
    }
}

export const testQuestionChallenge = async (req: IAuthorizedRequest, res: Response, next: NextFunction) => {
    try {
        const res: ITestPromoUserApi | null = req.resLastMiddleware;
        const resultCommands: IQuestionResponse[] | undefined = req.resultsCommands;

        if (res && resultCommands) {

            for (const questionResponse of resultCommands) {
                let question: IQuestion | undefined = res.test?.questions?.find(question => question.questionId === questionResponse.id);
                if (question?.result === questionResponse.value) {
                    questionResponse.success = true;
                    let response: IReponseCreate = {
                        questionId: question.questionId,
                        testPromoUserId: res.testPromoUserId,
                        score: question.score
                    }
                    try{

                        await Crud.Create<IReponseCreate>({
                            table: 'reponse',
                            body: response
                        });
                    }catch(error){
                        console.log(error);
                    }
                }
            }
            res.responses = resultCommands;
        }

        next();
    } catch (error) {
        next(error);
    }
}