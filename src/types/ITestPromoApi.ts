import { IPromo } from "../model/IPromo";
import { ITest } from "../model/ITest";
import { ITestPromo } from "../model/ITestPromo";

export interface ITestPromoApi extends ITestPromo {
    test?:ITest;
    promo?:IPromo;
}