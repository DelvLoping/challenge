import { Body, Delete, Get, Path, Post, Put, Query, Request, Route, Security } from 'tsoa';
import { ACCESSTESTPROMO, ITestPromo, ITestPromoCreate, ITestPromoUpdate } from '../../model/ITestPromo';
import { ICreateResponse } from '../../types/ICreateResponse';
import { IIndexResponse, IReadWhere } from '../../types/IIndexQuery';
import { IUpdateResponse } from '../../types/IUpdateResponse';
import { IAuthorizedRequest } from '../../types/IAuthorizedRequest';
import { ControllerModel } from './ControllerModel';

const READ_COLUMNS = ['testPromoId', 'testId', 'promoId'];
const ACCES = ACCESSTESTPROMO;
/**
 * Un test d'une promo de la plateforme.
 */
@Route("/test_promo")
@Security('jwt')

export class TestPromoController extends ControllerModel<ITestPromo, ITestPromoCreate, ITestPromoUpdate> {
  constructor() {
    super('test_promo', READ_COLUMNS, ACCES);
  }

  /**
   * Récupérer une page des tests d'une promo.
   */
  @Get()
  public async getTestPromos(
    @Request() req: IAuthorizedRequest,
    /** La page (zéro-index) à récupérer */
    @Query() page?: string,
    /** Le nombre d'éléments à récupérer (max 50) */
    @Query() limit?: string,
  ): Promise<IIndexResponse<ITestPromo> | undefined> {
    return super.getItems(req, page, limit);
  }


  /**
   * Créer un nouveau test d'une promo
   */
  @Post()
  public async createTestPromo(
    @Request() req: IAuthorizedRequest,
    @Body() body: ITestPromoCreate
  ): Promise<ICreateResponse | undefined> {
    return super.createItem(req, body);
  }

  /**
   * Récupérer un test d'une promo avec le ID passé dans le URL
   */
  @Get('{testPromoId}')
  public async readTestPromo(
    @Request() req: IAuthorizedRequest,
    @Path() testPromoId: number
  ): Promise<ITestPromo | undefined> {
    return super.getItem(req, testPromoId,READ_COLUMNS[0]);
  }

  /**
   * Mettre à jour un test d'une promo avec le ID passé dans le URL
   */
  @Put('{testPromoId}')
  public async updateTestPromo(
    @Request() req: IAuthorizedRequest,
    @Path() testPromoId: number,
    @Body() body: ITestPromoUpdate
  ): Promise<IUpdateResponse | undefined> {
    return super.updateItem(req, testPromoId,READ_COLUMNS[0], body);
  }

  /**
   * Supprimer un test d'une promo
   */
  @Delete('{testPromoId}')
  public async deleteTestPromo(
    @Request() req: IAuthorizedRequest,
    @Path() testPromoId: number,
  ): Promise<IUpdateResponse | undefined> {
    return super.deleteItem(req, testPromoId,READ_COLUMNS[0]);
  }
}