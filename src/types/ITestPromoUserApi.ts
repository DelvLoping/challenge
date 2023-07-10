import { IPromo } from "../model/IPromo";
import { IReponse } from "../model/IReponse";
import { ITestPromoUser } from "../model/ITestPromoUser";
import { IQuestionResponse } from "./IQuestionReponse";
import { ITestApi } from "./ITestApi";

export interface ITestPromoUserApi extends ITestPromoUser {
    promo?: IPromo;
    test?: ITestApi;
    responses?: IQuestionResponse[];
    reponsesBd?: IReponse[];
} 