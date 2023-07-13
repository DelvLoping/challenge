
// Définition d'un structure ITestPromo
// A noter, le ? veut dire que le champ est optionnel

import { Access } from "../utility/acces/Access";



export interface ITestPromo{
  testPromoId: number;
  testId?: number;
  promoId?: number;
  open?: boolean;

}

export const ACCESSTESTPROMO:Access[] = [{
  attribut: "testPromoId",
  table: "test_promo",
  action: [{action:"CREATE",codeMin:2},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:2},{action:"DELETE",codeMin:2}]
},{
  attribut: "testId",
  table: "test_promo",
  action: [{action:"CREATE",codeMin:2},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:2},{action:"DELETE",codeMin:2}]
},{
  attribut: "promoId",
  table: "test_promo",
  action: [{action:"CREATE",codeMin:2},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:2},{action:"DELETE",codeMin:2}]
}
,{
  attribut: "open",  
  table: "test_promo",
  action: [{action:"CREATE",codeMin:2},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:2},{action:"DELETE",codeMin:2}]
} ]
// Outils de manipulation des types :
// https://www.typescriptlang.org/docs/handbook/utility-types.html
// Ici, on rend tous les champs "lecture seul". Typescript ne va pas autoriser l'affectation des champs
export type ITestPromoRO = Readonly<ITestPromo>;

export type ITestPromoCreate = Omit<ITestPromo, 'testPromoId'>;

export type ITestPromoUpdate = Partial<ITestPromoCreate>;