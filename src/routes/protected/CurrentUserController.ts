import { Router } from "express";
import { Get, Route, Security, Request, Path, Middlewares } from 'tsoa';
import { IAuthorizedRequest } from "../../types/IAuthorizedRequest";
import { ACCESSTESTPROMOUSER, ITestPromoUser } from "../../model/ITestPromoUser";
import { ACCESSTEST, ITest } from "../../model/ITest";
import { ACCESSPROMO, IPromo } from "../../model/IPromo";
import { getChallengeMiddleware, clearResponseMiddleware, connecteSshMiddleware, testQuestionChallenge, getChallengesMiddleware, getReponsesForEachChallenges } from "../../middleware/challenge.middleware";
import { ITestPromoUserApi } from "../../types/ITestPromoUserApi";
import { filterBody, filterColumns } from "../../utility/acces/Access";
import { ACCESSQUESTION } from "../../model/IQuestion";
import { IUserApi } from "../../types/IUserApi";
import { Crud } from "../../utility/Crud";
import { ACCESSUSER } from "../../model/IUser";
import { ApiError } from "../../utility/Error/ApiError";
import { ErrorCode } from "../../utility/Error/ErrorCode";
import { ACCESSPROFILE } from "../../model/IProfile";
import { IIndexResponse, IReadWhere } from "../../types/IIndexQuery";
import { ITestPromo } from "../../model/ITestPromo";

const READ_COLUMNSUser = ['userId', 'familyName', 'givenName', 'email', 'profileId'];
const ACCESUser = ACCESSUSER;

const READ_COLUMNSProfile = ['profileId', 'profileName', 'profileCode'];
const ACCESProfile = ACCESSPROFILE;

const READ_COLUMNSTestPromoUser = ['testPromoUserId', 'testPromoId', 'userId', 'urlServer', 'userServer', 'passwordServer', 'bdUserServer', 'bdPasswordServer'];
const ACCESTestPromoUser = ACCESSTESTPROMOUSER;

const router = Router({ mergeParams: true });

@Route("/currentUser")
@Security('jwt')
export class CurrentUserController {

  /**
   * Lancé le challenge pour l'utilisateur connecté
   **/
  @Get('')
  public async getCurrentUser(
    @Request() request: IAuthorizedRequest,
  ): Promise<IUserApi | undefined> {
    let user: IUserApi | undefined = undefined;
    let userId = request.userId ?? 0;
    let profileCode = request.profileCode ?? 0;

    if (userId !== 0) {
      const columnsUser = filterColumns("READ", READ_COLUMNSUser, ACCESUser, profileCode);

      if (columnsUser.length === 0) {
        throw new ApiError(ErrorCode.Unauthorized, 'validation/notAuthorized', `Operation not authorized`);
      }

      user = await Crud.Read({
        table: 'user',
        key: 'userId',
        value: userId,
        columns: columnsUser
      });
    }

    if (user?.userId) {
      if (profileCode !== 0) {

        const columnsProfile = filterColumns("READ", READ_COLUMNSProfile, ACCESProfile, profileCode);

        if (columnsProfile.length === 0) {
          throw new ApiError(ErrorCode.Unauthorized, 'validation/notAuthorized', `Operation not authorized`);
        }

        user.profile = await Crud.Read({
          table: 'profile',
          key: 'profileCode',
          value: profileCode,
          columns: columnsProfile
        });
      }


      const columnsTestPromoUser = filterColumns("READ", READ_COLUMNSTestPromoUser, ACCESTestPromoUser, profileCode);

      if (columnsTestPromoUser.length === 0) {
        throw new ApiError(ErrorCode.Unauthorized, 'validation/notAuthorized', `Operation not authorized`);
      }
      let result: IIndexResponse<ITestPromoUserApi> | undefined = undefined;
      let where: IReadWhere | null = null;
      where = {}
      where.userId = user.userId;
      result = await Crud.Index({
        table: 'test_promo_user',
        where: where,
        columns: columnsTestPromoUser
      });
      if (result.total > 0) {
        user.challenges = result.rows;
        let res = await Promise.all(user.challenges.map(async (challenge) => {
          if (challenge.testPromoId) {
            let testpromo: ITestPromo | undefined = undefined;
            testpromo = await Crud.Read({
              table: 'test_promo',
              key: 'testPromoId',
              value: challenge.testPromoId,
              columns: ['*']
            });
            if(testpromo){
              challenge.test = await Crud.Read({
                table: 'test',
                key: 'testId',
                value: testpromo.testId,
                columns: ['*']
              });
              challenge.promo = await Crud.Read({
                table: 'promo',
                key: 'promoId',
                value: testpromo.promoId,
                columns: ['*']
              });
            }

          }
          return challenge;
        }));

        user.challenges = res;
      }
    } else {
      throw new ApiError(ErrorCode.NotFound, 'sql/not-found', `User not found`);
    }


    return user;
  }

}

