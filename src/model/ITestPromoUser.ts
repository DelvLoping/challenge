
// Définition d'un structure ITestPromoUser
// A noter, le ? veut dire que le champ est optionnel

import { Access } from "../utility/acces/Access";



export interface ITestPromoUser{
  testPromoUserId: number;
  testPromoId: number;
  userId: number;
  urlServer?: string;
  userServer?: string;
  passwordServer?: string;
  bdUserServer?: string;
  bdPasswordServer?: string;
}

export const ACCESSTESTPROMOUSER:Access[] = [{
  attribut: "testPromoUserId",
  table: "test_promo_user",
  action: [{action:"CREATE",codeMin:1},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:1},{action:"DELETE",codeMin:1}]
},{
  attribut: "testPromoId",
  table: "test_promo_user",
  action: [{action:"CREATE",codeMin:1},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:1},{action:"DELETE",codeMin:1}]
},{
  attribut: "userId",
  table: "test_promo_user",
  action: [{action:"CREATE",codeMin:1},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:1},{action:"DELETE",codeMin:1}]
},{
  attribut: "urlServer",
  table: "test_promo_user",
  action: [{action:"CREATE",codeMin:1},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:1},{action:"DELETE",codeMin:1}]
},{
  attribut: "userServer",
  table: "test_promo_user",
  action: [{action:"CREATE",codeMin:1},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:1},{action:"DELETE",codeMin:1}]
},{
  attribut: "passwordServer",
  table: "test_promo_user",
  action: [{action:"CREATE",codeMin:1},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:1},{action:"DELETE",codeMin:1}]
},{
  attribut: "bdUserServer",
  table: "test_promo_user",
  action: [{action:"CREATE",codeMin:1},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:2},{action:"DELETE",codeMin:1}]
},{
  attribut: "bdPasswordServer",
  table: "test_promo_user",
  action: [{action:"CREATE",codeMin:1},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:2},{action:"DELETE",codeMin:1}]
}]
// Outils de manipulation des types :
// https://www.typescriptlang.org/docs/handbook/utility-types.html
// Ici, on rend tous les champs "lecture seul". Typescript ne va pas autoriser l'affectation des champs
export type ITestPromoUserRO = Readonly<ITestPromoUser>;

export type ITestPromoUserCreate = Omit<ITestPromoUser, 'testPromoUserId'>;

export type ITestPromoUserUpdate = Partial<ITestPromoUserCreate>;