import { Body, Delete, Get, Path, Post, Put, Query, Request, Route, Security } from 'tsoa';
import { ACCESSPROFILE, IProfile, IProfileCreate, IProfileUpdate } from '../../model/IProfile';
import { ICreateResponse } from '../../types/ICreateResponse';
import { IIndexResponse } from '../../types/IIndexQuery';
import { IUpdateResponse } from '../../types/IUpdateResponse';
import { IAuthorizedRequest } from '../../types/IAuthorizedRequest';
import { ControllerModel } from './ControllerModel';

const READ_COLUMNS = ['profileId', 'profileName', 'profileCode'];
const ACCES = ACCESSPROFILE;

/**
 * Un profile de la plateforme.
 */
@Route("/profile")
@Security('jwt')

export class ProfileController extends ControllerModel<IProfile, IProfileCreate, IProfileUpdate> {
  constructor() {
    super('profile', READ_COLUMNS, ACCES);
  }

  /**
   * Récupérer une page de profiles.
   */
  @Get()
  public async getProfiles(
    @Request() req: IAuthorizedRequest,
    /** La page (zéro-index) à récupérer */
    @Query() page?: string,
    /** Le nombre d'éléments à récupérer (max 50) */
    @Query() limit?: string,
  ): Promise<IIndexResponse<IProfile> | undefined> {
    return super.getItems(req, page, limit);
  }

  /**
   * Créer un nouveau profile
   */
  @Post()
  public async createProfile(
    @Request() req: IAuthorizedRequest,
    @Body() body: IProfileCreate
  ): Promise<ICreateResponse | undefined> {
    return super.createItem(req, body);
  }


  /**
   * Récupérer une profile avec le ID passé dans le URL
   */
  @Get('{profileId}')
  public async readProfile(
    @Request() req: IAuthorizedRequest,
    @Path() profileId: number
  ): Promise<IProfile | undefined> {
    return super.getItem(req, profileId);

  }

  /**
   * Mettre à jour un profile avec le ID passé dans le URL
   */
  @Put('{profileId}')
  public async updateProfile(
    @Request() req: IAuthorizedRequest,
    @Path() profileId: number,
    @Body() body: IProfileUpdate
  ): Promise<IUpdateResponse | undefined> {
    return super.updateItem(req, profileId, body);
  }

  /**
   * Supprimer un profile
   */
  @Delete('{profileId}')
  public async deleteProfile(
    @Request() req: IAuthorizedRequest,
    @Path() profileId: number,
  ): Promise<IUpdateResponse | undefined> {
    return super.deleteItem(req, profileId);
  }

}