
import { useState, useEffect } from "react";
import radialGradient from "assets/theme/functions/radialGradient";
import { Link, useHistory, useLocation } from "react-router-dom";
import GradientBorder from "examples/GradientBorder";

import palette from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";
import VuiButton from "components/VuiButton";
import VuiTypography from "components/VuiTypography";
import VuiInput from "components/VuiInput";
import Card from "@mui/material/Card";
import VuiBox from "components/VuiBox";
import { Grid } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import { useVisionUIController } from "context";
import { getJwtCookie } from "CookieService";
import { setUser } from "context";
import VuiSwitch from "components/VuiSwitch";


function Question(props) {

    const [questionCode, setQuestionCode] = useState(props.questionCode);
    const [questionText, setQuestionText] = useState(props.questionText);
    const [score, setScore] = useState(props.score);
    const [cmd, setCmd] = useState(props.cmd);
    const [result, setResult] = useState(props.result);
    const [useBdd, setUseBdd] = useState(props.useBdd);

    useEffect(() => {
        if (props.question) {
            setQuestionCode(props.question.questionCode);
            setQuestionText(props.question.questionText);
            setScore(props.question.score);
            setCmd(props.question.cmd);
            setResult(props.question.result);
            setUseBdd(props.question.useBdd);
        }
    }, [props.question])

    const handleChangeQuestionCode = (event) => {
        setQuestionCode(event.target.value);
    };

    const handleChangeQuestionText = (event) => {
        setQuestionText(event.target.value);
    };

    const handleChangeScore = (event) => {
        setScore(event.target.value);
    };

    const handleChangeCmd = (event) => {
        setCmd(event.target.value);
    };

    const handleChangeResult = (event) => {
        setResult(event.target.value);
    };

    const handleChangeUseBdd = () => {
        setUseBdd(!useBdd);
    };


    const sendQuestion = () => {
        let action = props.addQuestion;
        let question = { questionCode: questionCode, questionText: questionText, score: score, cmd: cmd, result: result, useBdd: useBdd };

        if (props.question) {
            action = props.updateQuestion;
            question = { ...question, questionId: props.question.questionId };
        }

        action(question);

    }

    let isChange = props.question ? props.question.questionCode !== questionCode || props.question.questionText !== questionText || props.question.score !== score || props.question.cmd !== cmd || props.question.result !== result || props.question.useBdd !== useBdd : false;
    return (
        <>
            <Card m={1}>

                <VuiBox mb={2} display="flex" flexDirection="row" justifyContent="center">

                    <VuiBox mb={2}>

                        <VuiBox mb={1} ml={0.5}>
                            <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                                Code
                            </VuiTypography>
                        </VuiBox>
                        <GradientBorder
                            minWidth="100%"
                            padding="1px"
                            borderRadius={borders.borderRadius.lg}
                            backgroundImage={radialGradient(
                                palette.gradients.borderLight.main,
                                palette.gradients.borderLight.state,
                                palette.gradients.borderLight.angle
                            )}
                        >
                            <VuiInput value={questionCode} onChange={handleChangeQuestionCode} type="number" placeholder="code" fontWeight="500" />
                        </GradientBorder>
                        <VuiBox mb={1} ml={0.5}>
                            <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                                Text
                            </VuiTypography>
                        </VuiBox>
                        <GradientBorder
                            minWidth="100%"
                            padding="1px"
                            borderRadius={borders.borderRadius.lg}
                            backgroundImage={radialGradient(
                                palette.gradients.borderLight.main,
                                palette.gradients.borderLight.state,
                                palette.gradients.borderLight.angle
                            )}
                        >
                            <VuiInput value={questionText} onChange={handleChangeQuestionText} type="string" placeholder="i want to create ..." fontWeight="500" />
                        </GradientBorder>
                        <VuiBox mb={1} ml={0.5}>
                            <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                                Score
                            </VuiTypography>
                        </VuiBox>
                        <GradientBorder
                            minWidth="100%"
                            padding="1px"
                            borderRadius={borders.borderRadius.lg}
                            backgroundImage={radialGradient(
                                palette.gradients.borderLight.main,
                                palette.gradients.borderLight.state,
                                palette.gradients.borderLight.angle
                            )}
                        >
                            <VuiInput value={score} onChange={handleChangeScore} type="number" placeholder="Enter number..." fontWeight="500" />
                        </GradientBorder>
                        <VuiBox mb={1} ml={0.5}>
                            <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                                Command
                            </VuiTypography>
                        </VuiBox>
                        <GradientBorder
                            minWidth="100%"
                            padding="1px"
                            borderRadius={borders.borderRadius.lg}
                            backgroundImage={radialGradient(
                                palette.gradients.borderLight.main,
                                palette.gradients.borderLight.state,
                                palette.gradients.borderLight.angle
                            )}
                        >
                            <VuiInput value={cmd} onChange={handleChangeCmd} type="string" placeholder="sudo ls ..." fontWeight="500" />
                        </GradientBorder>
                        <VuiBox mb={1} ml={0.5}>
                            <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                                Result
                            </VuiTypography>
                        </VuiBox>
                        <GradientBorder
                            minWidth="100%"
                            padding="1px"
                            borderRadius={borders.borderRadius.lg}
                            backgroundImage={radialGradient(
                                palette.gradients.borderLight.main,
                                palette.gradients.borderLight.state,
                                palette.gradients.borderLight.angle
                            )}
                        >
                            <VuiInput value={result} onChange={handleChangeResult} type="string" placeholder="" fontWeight="500" />
                        </GradientBorder>
                        <VuiBox display="flex" mb="14px">
                            <VuiBox mt={0.25}>
                                <VuiSwitch color="info" checked={useBdd} onChange={handleChangeUseBdd} />
                            </VuiBox>
                            <VuiBox width="80%" ml={2}>
                                <VuiTypography variant="button" fontWeight="regular" color="text">
                                    Use BDD
                                </VuiTypography>
                            </VuiBox>
                        </VuiBox>
                        <VuiBox mt={4} mb={1}>
                            <VuiButton color="info" fullWidth onClick={sendQuestion} disabled={!isChange}>
                                {props.question ?isChange?"UPDATE" :"NO CHANGE": "ADD"}
                            </VuiButton>
                        </VuiBox>
                    </VuiBox>
                </VuiBox>

            </Card>
        </>
    );
}
export default Question;