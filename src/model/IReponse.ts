
// Définition d'un structure IReponse
// A noter, le ? veut dire que le champ est optionnel

import { Access } from "../utility/acces/Access";


export interface IReponse{
  reponseId: number;
  score?: number;
  questionId: number;
  testPromoUserId: number;

}
export const ACCESSRESPONSE:Access[] = [{
  attribut: "reponseId",
  table: "reponse",
  action: [{action:"CREATE",codeMin:2},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:2},{action:"DELETE",codeMin:2}]
},{
  attribut: "score",
  table: "reponse",
  action: [{action:"CREATE",codeMin:2},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:2},{action:"DELETE",codeMin:2}]
},{
  attribut: "questionId",
  table: "reponse",
  action: [{action:"CREATE",codeMin:2},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:2},{action:"DELETE",codeMin:2}]
},{
  attribut: "testPromoUserId",
  table: "reponse",
  action: [{action:"CREATE",codeMin:2},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:2},{action:"DELETE",codeMin:2}]
}]

// Outils de manipulation des types :
// https://www.typescriptlang.org/docs/handbook/utility-types.html
// Ici, on rend tous les champs "lecture seul". Typescript ne va pas autoriser l'affectation des champs
export type IReponseRO = Readonly<IReponse>;

export type IReponseCreate = Omit<IReponse, 'reponseId'>;

export type IReponseUpdate = Partial<IReponseCreate>;