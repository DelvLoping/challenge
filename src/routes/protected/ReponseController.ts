import { Body, Delete, Get, Path, Post, Put, Query, Request, Route, Security } from 'tsoa';
import { ACCESSRESPONSE, IReponse, IReponseCreate, IReponseUpdate } from '../../model/IReponse';
import { ICreateResponse } from '../../types/ICreateResponse';
import { IIndexResponse } from '../../types/IIndexQuery';
import { IUpdateResponse } from '../../types/IUpdateResponse';
import { IAuthorizedRequest } from '../../types/IAuthorizedRequest';
import { ControllerModel } from './ControllerModel';

const READ_COLUMNS = ['reponseId', 'score', 'reponseId', 'testPromoUserId'];
const ACCES = ACCESSRESPONSE;
/**
 * Une reponse d'un utilisateur à une reponse  de la plateforme.
 */
@Route("/reponse")
@Security('jwt')

export class ReponseController extends ControllerModel<IReponse, IReponseCreate, IReponseUpdate> {
  constructor() {
    super('reponse', READ_COLUMNS, ACCES);
  }

  /**
   * Récupérer une page des réponses des utilisateurs  aux questions.
   */
  @Get()
  public async getReponses(
    @Request() req: IAuthorizedRequest,
    /** La page (zéro-index) à récupérer */
    @Query() page?: string,
    /** Le nombre d'éléments à récupérer (max 50) */
    @Query() limit?: string,
  ): Promise<IIndexResponse<IReponse> | undefined> {
    return super.getItems(req, page, limit);
  }

  /**
   * Créer une nouvelle réponse d'un utilisateur à une reponse
   */
  @Post()
  public async createReponse(
    @Request() req: IAuthorizedRequest,
    @Body() body: IReponseCreate
  ): Promise<ICreateResponse | undefined> {
    return super.createItem(req, body);
  }

  /**
   * Récupérer une réponse d'un utilisateur à une reponse avec le ID passé dans le URL
   */
  @Get('{reponseId}')
  public async readReponse(
    @Request() req: IAuthorizedRequest,
    @Path() reponseId: number
  ): Promise<IReponse | undefined> {
    return super.getItem(req, reponseId,READ_COLUMNS[0]);

  }

  /**
   * Mettre à jour une réponse d'un utilisateur à une reponse avec le ID passé dans le URL
   */
  @Put('{reponseId}')
  public async updateReponse(
    @Request() req: IAuthorizedRequest,
    @Path() reponseId: number,
    @Body() body: IReponseUpdate
  ): Promise<IUpdateResponse | undefined> {
    return super.updateItem(req, reponseId,READ_COLUMNS[0], body);
  }

  /**
   * Supprimer une réponse d'un utilisateur à une reponse
   */
  @Delete('{reponseId}')
  public async deleteReponse(
    @Request() req: IAuthorizedRequest,
    @Path() reponseId: number,
  ): Promise<IUpdateResponse | undefined> {
    return super.deleteItem(req, reponseId,READ_COLUMNS[0]);
  }

}