
// Définition d'un structure IUser
// A noter, le ? veut dire que le champ est optionnel

import { Access } from "../utility/acces/Access";



export interface IProfile{
  profileId: number;
  profileName: string;
  profileCode: number;
}

export const ACCESSPROFILE:Access[] = [{
  attribut: "profileId",
  table: "profile",
  action: [{action:"CREATE",codeMin:3},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:3},{action:"DELETE",codeMin:3}]
},{
  attribut: "profileName",
  table: "profile",
  action: [{action:"CREATE",codeMin:3},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:3},{action:"DELETE",codeMin:3}]
},{
  attribut: "profileCode",
  table: "profile",
  action: [{action:"CREATE",codeMin:3},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:3},{action:"DELETE",codeMin:3}]
}]

// Outils de manipulation des types :
// https://www.typescriptlang.org/docs/handbook/utility-types.html
// Ici, on rend tous les champs "lecture seul". Typescript ne va pas autoriser l'affectation des champs
export type IProfileRO = Readonly<IProfile>;

export type IProfileCreate = Omit<IProfile, 'profileId'>;

export type IProfileUpdate = Partial<IProfileCreate>;