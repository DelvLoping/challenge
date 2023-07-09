import { Crud } from '../../utility/Crud';
import { filterBody, filterColumns } from '../../utility/acces/Access';
import { ApiError } from '../../utility/Error/ApiError';
import { ErrorCode } from '../../utility/Error/ErrorCode';
import { IAuthorizedRequest } from '../../types/IAuthorizedRequest';
import { ICreateResponse } from '../../types/ICreateResponse';
import { IIndexResponse } from '../../types/IIndexQuery';
import { IUpdateResponse } from '../../types/IUpdateResponse';
import { DbTable } from '../../model/DbTable';

export abstract class ControllerModel<T, TCreate, TUpdate> {
  protected readonly table: DbTable;
  protected readonly readColumns: string[];
  protected readonly access: any;

  constructor(table: DbTable, readColumns: string[], access: any) {
    this.table = table;
    this.readColumns = readColumns;
    this.access = access;
  }

  public async getItems(
    req: IAuthorizedRequest,
    page?: string,
    limit?: string
  ): Promise<IIndexResponse<T> | undefined> {
    const profileCode = req.profileCode ?? 0;
    const columns = filterColumns("READ", this.readColumns, this.access, profileCode);

    if (columns.length === 0) {
      throw new ApiError(ErrorCode.Unauthorized, 'validation/notAuthorized', `Operation not authorized`);
    }

    const res = await Crud.Index<T>({
      query: { page, limit },
      table: this.table,
      columns: columns
    });

    return res;
  }

  public async createItem(
    req: IAuthorizedRequest,
    body: TCreate extends {} ? TCreate : never
  ): Promise<ICreateResponse | undefined> {
    const profileCode = req.profileCode ?? 0;
    const bodyres: any = filterBody("CREATE", body, this.access, profileCode);

    if (Object.keys(bodyres).length === 0 && Object.keys(body).length !== 0) {
      throw new ApiError(ErrorCode.Unauthorized, 'validation/notAuthorized', `Operation not authorized`);
    } else if (Object.keys(bodyres).length === 0 && Object.keys(body).length === 0) {
      return { id: -1 };
    }

    const res = await Crud.Create<TCreate>({
      body: bodyres,
      table: this.table
    });

    return res;
  }

  public async getItem(
    req: IAuthorizedRequest,
    id: number,
    idName:string
  ): Promise<T | undefined> {
    const profileCode = req.profileCode ?? 0;
    const columns = filterColumns("READ", this.readColumns, this.access, profileCode);

    if (columns.length === 0) {
      throw new ApiError(ErrorCode.Unauthorized, 'validation/notAuthorized', `Operation not authorized`);
    }

    const res = await Crud.Read<T>({
      table: this.table,
      key: idName,
      value: id,
      columns: columns
    });

    return res;
  }

  public async updateItem(
    req: IAuthorizedRequest,
    id: number,
    idName:string,
    body: TUpdate extends {} ? TUpdate : never,
  ): Promise<IUpdateResponse | undefined> {
    const profileCode = req.profileCode ?? 0;
    const bodyres: any = filterBody("UPDATE", body, this.access, profileCode);

    if (Object.keys(bodyres).length === 0 && Object.keys(body).length !== 0) {
      throw new ApiError(ErrorCode.Unauthorized, 'validation/notAuthorized', `Operation not authorized`);
    } else if (Object.keys(bodyres).length === 0 && Object.keys(body).length === 0) {
      return { rows: 0 };
    }

    const res = await Crud.Update<TUpdate>({
      body: body,
      table: this.table,
      key: idName,
      value: id
    });

    return res;
  }

  public async deleteItem(
    req: IAuthorizedRequest,
    id: number,
    idName:string
  ): Promise<IUpdateResponse | undefined> {
    const profileCode = req.profileCode ?? 0;
    const columns = filterColumns("DELETE", this.readColumns, this.access, profileCode);

    if (columns.length === 0) {
      throw new ApiError(ErrorCode.Unauthorized, 'validation/notAuthorized', `Operation not authorized`);
    }

    const res = await Crud.Delete({
      table: this.table,
      key: idName,
      value: id
    });

    return res;
  }
}
