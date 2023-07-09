import { Body, Delete, Get, Path, Post, Put, Query, Request, Route, Security } from 'tsoa';
import { ACCESSPROMO, IPromo, IPromoCreate, IPromoUpdate } from '../../model/IPromo';
import { ICreateResponse } from '../../types/ICreateResponse';
import { IIndexResponse } from '../../types/IIndexQuery';
import { IUpdateResponse } from '../../types/IUpdateResponse';
import { IAuthorizedRequest } from '../../types/IAuthorizedRequest';
import { ControllerModel } from './ControllerModel';

const READ_COLUMNS = ['promoId', 'promoName'];
const ACCES = ACCESSPROMO;

/**
 * Une promo de la plateforme.
 */
@Route("/promo")
@Security('jwt')

export class PromoController extends ControllerModel<IPromo, IPromoCreate, IPromoUpdate> {
  constructor() {
    super('promo', READ_COLUMNS, ACCES);
  }

  /**
   * Récupérer une page de promos.
   */
  @Get()
  public async getPromos(
    @Request() req: IAuthorizedRequest,
    /** La page (zéro-index) à récupérer */
    @Query() page?: string,
    /** Le nombre d'éléments à récupérer (max 50) */
    @Query() limit?: string,
  ): Promise<IIndexResponse<IPromo> | undefined> {
    return super.getItems(req, page, limit);
  }

  /**
   * Créer une nouvelle promo
   */
  @Post()
  public async createPromo(
    @Request() req: IAuthorizedRequest,
    @Body() body: IPromoCreate
  ): Promise<ICreateResponse | undefined> {
    return super.createItem(req, body);
  }

  /**
   * Récupérer une promo avec le ID passé dans le URL
   */
  @Get('{promoId}')
  public async readPromo(
    @Request() req: IAuthorizedRequest,
    @Path() promoId: number
  ): Promise<IPromo | undefined> {
    return super.getItem(req, promoId,READ_COLUMNS[0]);

  }

  /**
   * Mettre à jour une promo avec le ID passé dans le URL
   */
  @Put('{promoId}')
  public async updatePromo(
    @Request() req: IAuthorizedRequest,
    @Path() promoId: number,
    @Body() body: IPromoUpdate
  ): Promise<IUpdateResponse | undefined> {
    return super.updateItem(req, promoId,READ_COLUMNS[0], body);
  }

  /**
   * Supprimer une promo
   */
  @Delete('{promoId}')
  public async deletePromo(
    @Request() req: IAuthorizedRequest,
    @Path() promoId: number,
  ): Promise<IUpdateResponse | undefined> {
    return super.deleteItem(req, promoId,READ_COLUMNS[0]);
  }

}