
// Définition d'un structure IUser
// A noter, le ? veut dire que le champ est optionnel

import { Access } from "../utility/acces/Access";



export interface IUser{
  userId: number;
  familyName?: string;
  givenName?: string;
  email: string;
  profileId?: number;

}

export const ACCESSUSER:Access[] = [{
  attribut: "userId",
  table: "test_promo",
  action: [{action:"CREATE",codeMin:1},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:1},{action:"DELETE",codeMin:1}]
},{
  attribut: "familyName",
  table: "test_promo",
  action: [{action:"CREATE",codeMin:1},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:1},{action:"DELETE",codeMin:1}]
},{
  attribut: "givenName",
  table: "test_promo",
  action: [{action:"CREATE",codeMin:1},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:1},{action:"DELETE",codeMin:1}]
},{
  attribut: "email",
  table: "test_promo",
  action: [{action:"CREATE",codeMin:1},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:1},{action:"DELETE",codeMin:1}]
},{
  attribut: "profileId",
  table: "test_promo",
  action: [{action:"CREATE",codeMin:3},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:3},{action:"DELETE",codeMin:1}]
}]
// Outils de manipulation des types :
// https://www.typescriptlang.org/docs/handbook/utility-types.html
// Ici, on rend tous les champs "lecture seul". Typescript ne va pas autoriser l'affectation des champs
export type IUserRO = Readonly<IUser>;

export type IUserCreate = Omit<IUser, 'userId'>;

export type IUserUpdate = Partial<IUserCreate>;