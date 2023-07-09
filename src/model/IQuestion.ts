
// Définition d'un structure IQuestion
// A noter, le ? veut dire que le champ est optionnel

import { Access } from "../utility/acces/Access";

export interface IQuestion{
  questionId: number;
  questionText: string;
  questionCode: number;
  score: number;
  testId: number;
  cmd: string;
  result: string;
  useBdd?: boolean;
}

 export const ACCESSQUESTION:Access[] = [{
  attribut: "questionId",
  table: "question",
  action: [{action:"CREATE",codeMin:2},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:2},{action:"DELETE",codeMin:2}]
},{
  attribut: "questionText",
  table: "question",
  action: [{action:"CREATE",codeMin:2},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:2},{action:"DELETE",codeMin:2}]
},{
  attribut: "questionCode",
  table: "question",
  action: [{action:"CREATE",codeMin:2},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:2},{action:"DELETE",codeMin:2}]
},{
  attribut: "score",
  table: "question",
  action: [{action:"CREATE",codeMin:2},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:2},{action:"DELETE",codeMin:2}]
},{
  attribut: "testId",
  table: "question",
  action: [{action:"CREATE",codeMin:2},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:2},{action:"DELETE",codeMin:2}]
},{
  attribut: "cmd",
  table: "question",
  action: [{action:"CREATE",codeMin:2},{action:"READ",codeMin:2},{action:"UPDATE",codeMin:2},{action:"DELETE",codeMin:2}]
},{
attribut: "result",
  table: "question",
  action: [{action:"CREATE",codeMin:2},{action:"READ",codeMin:2},{action:"UPDATE",codeMin:2},{action:"DELETE",codeMin:2}]
},{
  attribut: "useBdd",
  table: "question",
  action: [{action:"CREATE",codeMin:2},{action:"READ",codeMin:1},{action:"UPDATE",codeMin:2},{action:"DELETE",codeMin:2}]
}]

// Outils de manipulation des types :
// https://www.typescriptlang.org/docs/handbook/utility-types.html
// Ici, on rend tous les champs "lecture seul". Typescript ne va pas autoriser l'affectation des champs
export type IQuestionRO = Readonly<IQuestion>;

export type IQuestionCreate = Omit<IQuestion, 'questionId'>;

export type IQuestionUpdate = Partial<IQuestionCreate>;