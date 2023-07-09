import { Body } from "tsoa";
import { DbTable } from "../../model/DbTable";

export interface  Access{
    attribut: string;
    table: DbTable;
    action: Action[];
}

export interface Action{
    action:string;
    codeMin:number;
}

export function filterBody(action:string,val:any,acces:Access[],profile:number):any{
    let valres = {...val};
    for(const itemAccess of acces){
        for(const item in valres){
            if(itemAccess.attribut===item){
                let codeMin: number = itemAccess?.action?.find((element) => element.action === action)?.codeMin ?? 0;
                if(profile<codeMin){
                    delete valres[item];
                }
            }
        }
    }
    return valres;
}

export function filterColumns(action: string, listColumns: string[], acces: Access[], profile: number): string[] {
    let list = [...listColumns];
    for (const itemAccess of acces) {
      for (const columns in list) {
        if (itemAccess.attribut === list[columns]) {
          let codeMin: number = itemAccess?.action?.find((element) => element.action === action)?.codeMin ?? 0;
          if (profile < codeMin) {
            list.splice(parseInt(columns), 1);
          }
        }
      }
    }
    return list;
  }
  