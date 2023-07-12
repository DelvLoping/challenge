import { Body, Delete, Get, Middlewares, Path, Post, Put, Query, Request, Route, Security } from 'tsoa';
import { ACCESSTESTPROMO, ITestPromo, ITestPromoCreate, ITestPromoUpdate } from '../../model/ITestPromo';
import { ICreateResponse } from '../../types/ICreateResponse';
import { IIndexResponse, IReadWhere } from '../../types/IIndexQuery';
import { IUpdateResponse } from '../../types/IUpdateResponse';
import { IAuthorizedRequest } from '../../types/IAuthorizedRequest';
import { ControllerModel } from './ControllerModel';
import { ITestPromoApi } from '../../types/ITestPromoApi';
import { ITest } from '../../model/ITest';
import { IPromo } from '../../model/IPromo';
import { Crud } from '../../utility/Crud';

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
   * Récupérer une page des tests d'une promo.
   */
  @Get("/open")
  public async getTestPromosOpen(
    @Request() req: IAuthorizedRequest,
    /** La page (zéro-index) à récupérer */
    @Query() page?: string,
    /** Le nombre d'éléments à récupérer (max 50) */
    @Query() limit?: string,
  ): Promise<ITestPromoApi[] | undefined> {

    let testPromos: ITestPromoApi[] | undefined = undefined;
    let res: IIndexResponse<ITestPromo> | undefined = undefined;
    res = await this.getTestPromos(req, page, limit);
    if (res?.total && res?.total > 0) {
      testPromos = res.rows
      testPromos = await Promise.all(testPromos.map(async (testPromo: ITestPromoApi) => {
        let test: ITest | undefined = undefined
        let promo: IPromo | undefined = undefined
        let where: IReadWhere | null = null;
        if (testPromo.testId) {
          where = {}
          where.testId = testPromo.testId

          test = await Crud.Read<ITest>({
            table: 'test',
            columns: ["*"],
            where: where
          });
        }
        if (testPromo.promoId) {
          where = {}
          where.promoId = testPromo.promoId

          promo = await Crud.Read<IPromo>({
            table: 'promo',
            columns: ["*"],
            where: where
          });
        }
        if (test && promo) {
          testPromo.test = test
          testPromo.promo = promo
        }
        return testPromo;

      }));

    }

    return testPromos;
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
    return super.getItem(req, testPromoId, READ_COLUMNS[0]);
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
    return super.updateItem(req, testPromoId, READ_COLUMNS[0], body);
  }

  /**
   * Supprimer un test d'une promo
   */
  @Delete('{testPromoId}')
  public async deleteTestPromo(
    @Request() req: IAuthorizedRequest,
    @Path() testPromoId: number,
  ): Promise<IUpdateResponse | undefined> {
    return super.deleteItem(req, testPromoId, READ_COLUMNS[0]);
  }
}