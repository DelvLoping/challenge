import { Router } from "express";
import { Get, Route, Security, Request, Query, Middlewares } from 'tsoa';
import { IAuthorizedRequest } from "../../types/IAuthorizedRequest";
import { ACCESSTESTPROMOUSER } from "../../model/ITestPromoUser";
import { ACCESSTEST, ITest } from "../../model/ITest";
import { ACCESSPROMO, IPromo } from "../../model/IPromo";
import { getChallengeMiddleware, clearResponseMiddleware, connecteSshMiddleware, testQuestionChallenge, getChallengesMiddleware, getReponsesForEachChallenges } from "../../middleware/challenge.middleware";
import { ITestPromoUserApi } from "../../types/ITestPromoUserApi";
import { filterBody } from "../../utility/acces/Access";
import { ACCESSQUESTION } from "../../model/IQuestion";



const router = Router({ mergeParams: true });

@Route("/challenge")
@Security('jwt')
export class ChallengeController {

  @Get('/{testName}/{promoName}')
  @Middlewares(testQuestionChallenge)
  @Middlewares(connecteSshMiddleware)
  @Middlewares(clearResponseMiddleware)
  @Middlewares(getChallengeMiddleware)
  public async getChallenge(
    @Request() request: IAuthorizedRequest,
  ): Promise<ITestPromoUserApi | undefined> {
    let challenge: ITestPromoUserApi | undefined = request.resLastMiddleware;
    let profileCode = request.profileCode ?? 0;
    if (challenge?.test?.questions) {
      let questions = challenge.test.questions.map((question) => {
        let res = filterBody("READ", question, ACCESSQUESTION, profileCode);
        return res;
      })
      challenge.test.questions = questions;
    }
    if (challenge?.test) {
      challenge.test = filterBody("READ", challenge.test, ACCESSTEST, profileCode);
    }
    if (challenge?.promo) {
      challenge.promo = filterBody("READ", challenge.promo, ACCESSPROMO, profileCode);
    }
    if (challenge) {
      challenge = filterBody("READ", challenge, ACCESSTESTPROMOUSER, profileCode);
    }
    return challenge
  }

  @Get('/reponses/{testName}/{promoName}')
  @Middlewares(getReponsesForEachChallenges)
  @Middlewares(getChallengesMiddleware)
  public async getChallengeReponses(
    @Request() request: IAuthorizedRequest,
  ): Promise<ITestPromoUserApi | undefined> {

    return request.resLastMiddleware;;
  }

}

