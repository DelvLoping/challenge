import { Body, Delete, Get, Path, Post, Put, Query, Request, Route, Security } from 'tsoa';
import { ACCESSUSER, IUser, IUserCreate, IUserUpdate } from '../../model/IUser';
import { ICreateResponse } from '../../types/ICreateResponse';
import { IIndexResponse } from '../../types/IIndexQuery';
import { IUpdateResponse } from '../../types/IUpdateResponse';
import { IAuthorizedRequest } from '../../types/IAuthorizedRequest';
import { ControllerModel } from './ControllerModel';

const READ_COLUMNS = ['userId', 'familyName', 'givenName', 'email', 'profileId'];
const ACCES = ACCESSUSER;
/**
 * Un utilisateur de la plateforme.
 */
@Route("/user")
@Security('jwt')

export class UserController extends ControllerModel<IUser, IUserCreate, IUserUpdate> {
  constructor() {
    super('user', READ_COLUMNS, ACCES);
  }

  /**
   * Récupérer une page d'utilisateurs.
   */
  @Get()
  public async getUsers(
    @Request() req: IAuthorizedRequest,
    /** La page (zéro-index) à récupérer */
    @Query() page?: string,
    /** Le nombre d'éléments à récupérer (max 50) */
    @Query() limit?: string,
  ): Promise<IIndexResponse<IUser> | undefined> {
    return super.getItems(req, page, limit);
  }

  /**
   * Créer un nouvel utilisateur
   */
  @Post()
  public async createUser(
    @Request() req: IAuthorizedRequest,
    @Body() body: IUserCreate
  ): Promise<ICreateResponse | undefined> {
    return super.createItem(req, body);
  }

  /**
   * Récupérer une utilisateur avec le ID passé dans le URL
   */
  @Get('{userId}')
  public async readUser(
    @Request() req: IAuthorizedRequest,
    @Path() userId: number
  ): Promise<IUser | undefined> {
    return super.getItem(req, userId);

  }

  /**
   * Mettre à jour un utilisateur avec le ID passé dans le URL
   */
  @Put('{userId}')
  public async updateUser(
    @Request() req: IAuthorizedRequest,
    @Path() userId: number,
    @Body() body: IUserUpdate
  ): Promise<IUpdateResponse | undefined> {
    return super.updateItem(req, userId, body);
  }

  /**
   * Supprimer un utilisateur
   */
  @Delete('{userId}')
  public async deleteUser(
    @Request() req: IAuthorizedRequest,
    @Path() userId: number,
  ): Promise<IUpdateResponse | undefined> {
    return super.deleteItem(req, userId);
  }

}