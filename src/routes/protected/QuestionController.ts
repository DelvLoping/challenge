import { Body, Delete, Get, Path, Post, Put, Query, Request, Route, Security } from 'tsoa';
import { ACCESSQUESTION, IQuestion, IQuestionCreate, IQuestionUpdate } from '../../model/IQuestion';
import { ICreateResponse } from '../../types/ICreateResponse';
import { IIndexResponse } from '../../types/IIndexQuery';
import { IUpdateResponse } from '../../types/IUpdateResponse';
import { IAuthorizedRequest } from '../../types/IAuthorizedRequest';
import { ControllerModel } from './ControllerModel';

const READ_COLUMNS = ['questionId', 'questionText', 'questionCode', 'score', 'testId', 'cmd', 'result', 'useBdd'];
const ACCES = ACCESSQUESTION;
/**
 * Une question de la plateforme.
 */
@Route("/question")
@Security('jwt')

export class QuestionController extends ControllerModel<IQuestion, IQuestionCreate, IQuestionUpdate> {
  constructor() {
    super('question', READ_COLUMNS, ACCES);
  }

  /**
   * Récupérer une page de questions.
   */
  @Get()
  public async getQuestions(
    @Request() req: IAuthorizedRequest,
    /** La page (zéro-index) à récupérer */
    @Query() page?: string,
    /** Le nombre d'éléments à récupérer (max 50) */
    @Query() limit?: string,
    /** FIltre sur le test */
    @Query() testId?: string,
  ): Promise<IIndexResponse<IQuestion> | undefined> {
    const id = testId ? testId : undefined;
    return super.getItems(req, page, limit,'testId',id);
  }



  /**
   * Créer une nouvelle question
   */
  @Post()
  public async createQuestion(
    @Request() req: IAuthorizedRequest,
    @Body() body: IQuestionCreate
  ): Promise<ICreateResponse | undefined> {
    return super.createItem(req, body);
  }

  /**
   * Récupérer une question avec le ID passé dans le URL
   */
  @Get('{questionId}')
  public async readQuestion(
    @Request() req: IAuthorizedRequest,
    @Path() questionId: number
  ): Promise<IQuestion | undefined> {
    return super.getItem(req, questionId,READ_COLUMNS[0]);

  }

  /**
   * Mettre à jour un question avec le ID passé dans le URL
   */
  @Put('{questionId}')
  public async updateQuestion(
    @Request() req: IAuthorizedRequest,
    @Path() questionId: number,
    @Body() body: IQuestionUpdate
  ): Promise<IUpdateResponse | undefined> {
    return super.updateItem(req, questionId,READ_COLUMNS[0], body);
  }

  /**
   * Supprimer une question
   */
  @Delete('{questionId}')
  public async deleteQuestion(
    @Request() req: IAuthorizedRequest,
    @Path() questionId: number,
  ): Promise<IUpdateResponse | undefined> {
    return super.deleteItem(req, questionId,READ_COLUMNS[0]);
  }

}