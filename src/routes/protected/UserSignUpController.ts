import { Body, Delete, Get, Path, Post, Put, Query, Request, Route, Security } from 'tsoa';
import { ACCESSUSER, IUser, IUserCreate, IUserUpdate } from '../../model/IUser';
import { ICreateResponse } from '../../types/ICreateResponse';
import { IIndexResponse } from '../../types/IIndexQuery';
import { IUpdateResponse } from '../../types/IUpdateResponse';
import { IAuthorizedRequest } from '../../types/IAuthorizedRequest';
import { ControllerModel } from './ControllerModel';
import { filterBody } from '../../utility/acces/Access';
import { ApiError } from '../../utility/Error/ApiError';
import { ErrorCode } from '../../utility/Error/ErrorCode';
import { Crud } from '../../utility/Crud';

const READ_COLUMNS = ['userId', 'familyName', 'givenName', 'email', 'profileId'];
const ACCES = ACCESSUSER;
/**
 * Enregisrement d'un utilisateur.
 */
@Route("/user_sign_up")
export class UserSignUpController  {

  /**
   * Créer un nouvel utilisateur
   */
  @Post()
  public async createUser(
    @Request() req: IAuthorizedRequest,
    @Body() body: IUserCreate
  ): Promise<ICreateResponse | undefined> {
    const bodyres: any = filterBody("CREATE", body, ACCESSUSER, 1);

    if (Object.keys(bodyres).length === 0 && Object.keys(body).length !== 0) {
      throw new ApiError(ErrorCode.Unauthorized, 'validation/notAuthorized', `Operation not authorized`);
    } else if (Object.keys(bodyres).length === 0 && Object.keys(body).length === 0) {
      return { id: -1 };
    }
    return await Crud.Create<ICreateResponse>({
      body: bodyres,
      table:'user'
    });

  }


}