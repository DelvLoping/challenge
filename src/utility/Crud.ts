import { OkPacket, RowDataPacket } from 'mysql2';
import { DbTable } from '../model/DbTable';
import { ICreateResponse } from '../types/ICreateResponse';
import { IIndexQuery, IIndexResponse, IReadJoin, IReadWhere, ITableCount } from '../types/IIndexQuery';
import { IUpdateResponse } from '../types/IUpdateResponse';
import { DB } from './DB';
import { ApiError } from './Error/ApiError';
import { ErrorCode } from './Error/ErrorCode';


/**
 * Class qui fournit des fonctions utilitaires pour les opérations ICRUD.
 * 
 * @todo Pour l'instant la fonction Index ne marche que sur une seule table. Ajouter une fonction qui permet de faire des requêtes plus complexes (avec des joins et/ou aggrégations). Est-qu'il est possible de généraliser au maximum une telle opération, tout en laissant de la fléxibilité ?
 */
export class Crud<T, TCreate, TUpdate> {

  /**
   * Récupérer une page de lignes d'une table, en précisant les colonnes souhaitées
   * @param query L'objet contenant les paramètres optionnels de pagination.
   * @param table La table de la base de données à interroger
   * @param columns Un tableau de colonnes à retourner
   * @returns IIndexResponse contenant les résultats de la recherche.   
   * @todo Ajouter la possibilité de préciser les colonnes dans la requête ?
   */
  public static async Index<T>(options: {
    query?: IIndexQuery, 
    table: DbTable, 
    columns: string[], 
    where?: IReadWhere,
    join?: IReadJoin
  }) : Promise<IIndexResponse<T>> {

    const db = DB.Connection;      
    // On suppose que le params query sont en format string, et potentiellement
    // non-numérique, ou corrompu
    const page = parseInt(options.query?.page || "0") || 0;
    const limit = parseInt(options.query?.limit || "10") || 0;
    
    const offset = page * limit;

    // D'abord, récupérer le nombre total
    let whereClause = '';
    let wherevalues: any[] = [];
    if (options.where) {
      const whereList: string[] = [];
      Object.entries(options.where).forEach(
        ([key, value]) => {
          if(value)
          {
            whereList.push(key + ' = ?');
            wherevalues.push(value);
          }
        }
      )
      whereClause = 'where  ' + whereList.join(' and ');
    }
    let joinClause = '';
    if (options.join) {
      const joinList: string[] = [];
      Object.entries(options.join).forEach(
        ([key, value]) => {
          if(value)
          {
            joinList.push(' join '+key +' on ' + value);
          }
        
        }
      )
      joinClause = joinList.join(' ');
    }

    // console.log(mysql.format(`select count(*) as total from ${table} ${whereClause}`, wherevalues))

    const count = await db.query<ITableCount[] & RowDataPacket[]>(`select count(*) as total from ${options.table} ${joinClause} ${whereClause}`, wherevalues);      

    // Récupérer les lignes
    const sqlBase = `select ${options.columns.join(',')} from ${options.table} ${joinClause} ${whereClause} limit ? offset ?`;
    const data = await db.query<T[] & RowDataPacket[]>(sqlBase, [...wherevalues, limit, offset].filter(e => e !== undefined));

    // Construire la réponse
    const res: IIndexResponse<T> = {
      page,
      limit,
      total: count[0][0].total,
      rows: data[0]
    }

    return res;
  }

  public static async Create<T>(options: {
    body: T, 
    table: DbTable
  }): Promise<ICreateResponse> {
    const db = DB.Connection;
    const data = await db.query<OkPacket>(`insert into ${options.table} set ?`, options.body);

    return {
      id: data[0].insertId
    }   
  }

  public static async Update<T>(options: {
    body: T, 
    table: DbTable, 
    key: string, 
    value: number|string
  }): Promise<IUpdateResponse> {
    const db = DB.Connection;

    const data = await db.query<OkPacket>(`update ${options.table} set ? where ${options.key} = ?`, [options.body, options.value]);

    return {
      id: options.value,
      rows: data[0].affectedRows
    } 
  }

  public static async Read<T>(options: {
    table: DbTable, 
    key?: string, 
    value?: number|string, 
    columns: string[],
    where?: IReadWhere,
  }): Promise<T> {
    
    let whereClause = '';
    let wherevalues: any[] = [];
    if (options.where) {
      const whereList: string[] = [];
      Object.entries(options.where).forEach(
        ([key, value]) => {
          if(value)
          {
            whereList.push(key + ' = ?');
            wherevalues.push(value);
          }
        }
      )
      whereClause = whereList.join(' and ');
    }
    whereClause = `where ${options.key && options.value?options.key+' = ? '+(whereClause!==''?'and':''):''}` + whereClause;
    let params = options.value?[options.value]:[];

    const db = DB.Connection;
    const data = await db.query<T[] & RowDataPacket[]>(`select ${options.columns.join(',')} from ${options.table} ${whereClause}`, params.concat(wherevalues) );      

    if (data[0].length > 0) {
      return data[0][0];
    } else {
      //throw new ApiError(ErrorCode.BadRequest, 'sql/not-found', `Could not read row with "${whereClause}" and parameters "${params.concat(wherevalues)}"`);
      throw new ApiError(ErrorCode.NotFound, 'sql/not-found', `Could not find row`);
    }
  }

  public static async Delete(options: {
    table: DbTable, 
    key?: string, 
    value?: number|string, 
    where?: IReadWhere,
  }): Promise<IUpdateResponse> {

    let whereClause = '';
    let wherevalues: any[] = [];
    if (options.where) {
      const whereList: string[] = [];
      Object.entries(options.where).forEach(
        ([key, value]) => {
          if(value)
          {
            whereList.push(key + ' = ?');
            wherevalues.push(value);
          }
        }
      )
      whereClause = whereList.join(' and ');
    }
    whereClause = `where ${options.key && options.value?options.key+' = ? '+(whereClause!==''?'and':''):''}` + whereClause;
    let params = options.value?[options.value]:[];

    const db = DB.Connection;
    const data = await db.query<OkPacket>(`delete from ${options.table} ${whereClause}`, params.concat(wherevalues));      

    return {
      rows: data[0].affectedRows
    }  
  }

}