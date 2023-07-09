import { IQuestion } from "../model/IQuestion";
import { ITest } from "../model/ITest";

export interface ITestApi extends ITest {
    questions?: IQuestion[];
}