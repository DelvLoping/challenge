
// Définition d'un structure IPromo
// A noter, le ? veut dire que le champ est optionnel

import { Access } from "../utility/acces/Access";


export interface IPromo{
  promoId: number;
  promoName: string;

}

export const ACCESSPROMO:Access[] = [{
  attribut: "promoId",
  table: "promo",
  action: [{action:"CREATE",codeMin:2},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:2},{action:"DELETE",codeMin:2}]
},{
  attribut: "promoName",
  table: "promo",
  action: [{action:"CREATE",codeMin:2},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:2},{action:"DELETE",codeMin:2}]
}]

// Outils de manipulation des types :
// https://www.typescriptlang.org/docs/handbook/utility-types.html
// Ici, on rend tous les champs "lecture seul". Typescript ne va pas autoriser l'affectation des champs
export type IPromoRO = Readonly<IPromo>;

export type IPromoCreate = Omit<IPromo, 'promoId'>;

export type IPromoUpdate = Partial<IPromoCreate>;