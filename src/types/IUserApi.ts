import { IProfile } from "../model/IProfile";
import { IUser } from "../model/IUser";
import { ITestPromoUserApi } from "./ITestPromoUserApi";

export interface IUserApi extends IUser {
    challenges?: ITestPromoUserApi[];
    profile?: IProfile;
}