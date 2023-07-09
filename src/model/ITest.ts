
// Définition d'un structure ITest
// A noter, le ? veut dire que le champ est optionnel

import { Access } from "../utility/acces/Access";



export interface ITest{
  testId: number;
  testName: string;
  scoreMax?: number;
}
export const ACCESSTEST:Access[] = [{
  attribut: "testId",
  table: "test",
  action: [{action:"CREATE",codeMin:2},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:2},{action:"DELETE",codeMin:2}]
},{
  attribut: "testName",
  table: "test",
  action: [{action:"CREATE",codeMin:2},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:2},{action:"DELETE",codeMin:2}]
},{
  attribut: "scoreMax",
  table: "test",
  action: [{action:"CREATE",codeMin:2},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:2},{action:"DELETE",codeMin:2}]
}]
// Outils de manipulation des types :
// https://www.typescriptlang.org/docs/handbook/utility-types.html
// Ici, on rend tous les champs "lecture seul". Typescript ne va pas autoriser l'affectation des champs
export type ITestRO = Readonly<ITest>;

export type ITestCreate = Omit<ITest, 'testId'>;

export type ITestUpdate = Partial<ITest>;