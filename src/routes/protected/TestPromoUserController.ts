import { Body, Delete, Get, Path, Post, Put, Query, Request, Route, Security } from 'tsoa';
import { ACCESSTESTPROMOUSER, ITestPromoUser, ITestPromoUserCreate, ITestPromoUserUpdate } from '../../model/ITestPromoUser';
import { ICreateResponse } from '../../types/ICreateResponse';
import { IIndexResponse } from '../../types/IIndexQuery';
import { IUpdateResponse } from '../../types/IUpdateResponse';
import { IAuthorizedRequest } from '../../types/IAuthorizedRequest';
import { ControllerModel } from './ControllerModel';

const READ_COLUMNS = ['testPromoUserId', 'testPromoId', 'userId', 'urlServer', 'userServer', 'passwordServer', 'bdUserServer', 'bdPasswordServer'];
const ACCES = ACCESSTESTPROMOUSER;
/**
 * Un test d'une promo pour un utilisateur de la plateforme.
 */
@Route("/test_promo_user")
@Security('jwt')

export class TestPromoUserController extends ControllerModel<ITestPromoUser, ITestPromoUserCreate, ITestPromoUserUpdate> {
  constructor() {
    super('test_promo_user', READ_COLUMNS, ACCES);
  }

  /**
   * Récupérer une page d'un test d'une promo pour un utilisateur.
   */
  @Get()
  public async gettestPromoUsers(
    @Request() req: IAuthorizedRequest,
    /** La page (zéro-index) à récupérer */
    @Query() page?: string,
    /** Le nombre d'éléments à récupérer (max 50) */
    @Query() limit?: string,
  ): Promise<IIndexResponse<ITestPromoUser> | undefined> {
    return super.getItems(req, page, limit);
  }


  /**
   * Créer un nouveau test d'une promo pour un utilisateur
   */
  @Post()
  public async createtestPromoUser(
    @Request() req: IAuthorizedRequest,
    @Body() body: ITestPromoUserCreate
  ): Promise<ICreateResponse | undefined> {
    return super.createItem(req, body);
  }

  /**
   * Récupérer une test d'une promo pour un utilisateur avec le ID passé dans le URL
   */
  @Get('{testPromoUserId}')
  public async readtestPromoUser(
    @Request() req: IAuthorizedRequest,
    @Path() testPromoUserId: number
  ): Promise<ITestPromoUser | undefined> {
    return super.getItem(req, testPromoUserId,READ_COLUMNS[0]);

  }


  /**
   * Mettre à jour un test d'une promo pour un utilisateur avec le ID passé dans le URL
   */
  @Put('{testPromoUserId}')
  public async updatetestPromoUser(
    @Request() req: IAuthorizedRequest,
    @Path() testPromoUserId: number,
    @Body() body: ITestPromoUserUpdate
  ): Promise<IUpdateResponse | undefined> {
    return super.updateItem(req, testPromoUserId,READ_COLUMNS[0], body);
  }

  /**
   * Supprimer un test d'une promo pour un utilisateur
   */
  @Delete('{testPromoUserId}')
  public async deletetestPromoUser(
    @Request() req: IAuthorizedRequest,
    @Path() testPromoUserId: number,
  ): Promise<IUpdateResponse | undefined> {
    return super.deleteItem(req, testPromoUserId,READ_COLUMNS[0]);
  }

}