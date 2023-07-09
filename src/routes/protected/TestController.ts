import { Body, Delete, Get, Path, Post, Put, Query, Request, Route, Security } from 'tsoa';
import { ACCESSTEST, ITest, ITestCreate, ITestUpdate } from '../../model/ITest';
import { ICreateResponse } from '../../types/ICreateResponse';
import { IIndexResponse } from '../../types/IIndexQuery';
import { IUpdateResponse } from '../../types/IUpdateResponse';
import { IAuthorizedRequest } from '../../types/IAuthorizedRequest';
import { ControllerModel } from './ControllerModel';

const READ_COLUMNS = ['testId', 'testName', 'scoreMax'];
const ACCES = ACCESSTEST;
/**
 * Un test de la plateforme.
 */
@Route("/test")
@Security('jwt')

export class TestController extends ControllerModel<ITest, ITestCreate, ITestUpdate> {
  constructor() {
    super('test', READ_COLUMNS, ACCES);
  }

  /**
   * Récupérer une page de tests.
   */
  @Get()
  public async getTests(
    @Request() req: IAuthorizedRequest,
    /** La page (zéro-index) à récupérer */
    @Query() page?: string,
    /** Le nombre d'éléments à récupérer (max 50) */
    @Query() limit?: string,
  ): Promise<IIndexResponse<ITest> | undefined> {
    return super.getItems(req, page, limit);
  }

  /**
   * Créer un nouveau test
   */
  @Post()
  public async createTest(
    @Request() req: IAuthorizedRequest,
    @Body() body: ITestCreate
  ): Promise<ICreateResponse | undefined> {
    return super.createItem(req, body);
  }


  /**
   * Récupérer une test avec le ID passé dans le URL
   */
  @Get('{testId}')
  public async readTest(
    @Request() req: IAuthorizedRequest,
    @Path() testId: number
  ): Promise<ITest | undefined> {
    return super.getItem(req, testId);

  }

  /**
   * Mettre à jour un test avec le ID passé dans le URL
   */
  @Put('{testId}')
  public async updateTest(
    @Request() req: IAuthorizedRequest,
    @Path() testId: number,
    @Body() body: ITestUpdate
  ): Promise<IUpdateResponse | undefined> {
    return super.updateItem(req, testId, body);
  }

  /**
   * Supprimer un test
   */
  @Delete('{testId}')
  public async deleteTest(
    @Request() req: IAuthorizedRequest,
    @Path() testId: number,
  ): Promise<IUpdateResponse | undefined> {
    return super.deleteItem(req, testId);
  }

}