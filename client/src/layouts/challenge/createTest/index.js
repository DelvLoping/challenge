
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
import Question from "../components/question";

function CreateTest(props) {

    const History = useHistory();
    const location = useLocation();
    const [controller, dispatch] = useVisionUIController();
    const user = controller.user
    const jwt = controller.jwt;
    const [testId, setTestId] = useState(null);
    const [promoId, setPromoId] = useState(null);
    const [test, setTest] = useState(null);
    const [testMessage, setTestMessage] = useState(null);
    const [testName, setTestName] = useState(null);
    const [scoreMax, setScoreMax] = useState(null);
    const [testUseBdd, setTestUseBdd] = useState(false);
    const [promo, setPromo] = useState(null);
    const [promoMessage, setPromoMessage] = useState(null);
    const [promoName, setPromoName] = useState(null);
    const [testPromo, setTestPromo] = useState(null);
    const [testPromoId, setTestPromoId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [questionsave, setQuestionsave] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log(props.testPromo)
        if (props.testPromo) {
            setTestPromo(props.testPromo)
            setTestId(props.testPromo.testId)
            setPromoId(props.testPromo.promoId)

        }
        console.log(this)
    }, [props.testPromo]);

    useEffect(() => {
        setTestMessage(null)
        if (testId) {

            fetch((process.env.BASEURL || "https://challenge.delobeportfoliofrance.fr")+`/test/${testId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${jwt}`
                    }
                })
                .then((res) => res.json())
                .then((data) => {
                    if (data) {
                        if (data.code) {
                            console.log("status", data)
                            setError(data.message);
                            setTestMessage("Test non trouvé")
                            setTest(null)
                        } else {
                            setTest(data)
                            setTestMessage("Test trouvé")
                        }
                    }
                })
        }
    }, [testId]);

    useEffect(() => {
        setPromoMessage(null)
        if (promoId) {
            fetch((process.env.BASEURL || "https://challenge.delobeportfoliofrance.fr")+`/promo/${promoId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${jwt}`
                    }
                })
                .then((res) => res.json())
                .then((data) => {
                    if (data) {
                        if (data.code) {
                            console.log("status", data)
                            setError(data.message);
                            setPromoMessage("Promo non trouvée")
                            setPromo(null)
                        } else {
                            setPromo(data)
                            setPromoMessage("Promo trouvée")
                        }
                    }
                })
        }
    }, [promoId]);

    useEffect(() => {
        if (test) {
            setTestName(null)
            setScoreMax(null)
            setTestUseBdd(null)
            fetch((process.env.BASEURL || "https://challenge.delobeportfoliofrance.fr")+`/question?testId=${test.testId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${jwt}`
                    }
                })
                .then((res) => res.json())
                .then((data) => {
                    if (data) {
                        if (data.code) {
                            console.log("status", data)
                            setError(data.message);
                        } else {
                            if (data.total > 0) {
                                setQuestions(data.rows)
                                setQuestionsave(data.rows)
                            } else {
                                setQuestions([])
                                setQuestionsave([])
                            }
                        }
                    }
                })

            setTestName(test.testName)
            setScoreMax(test.scoreMax)
            setTestUseBdd(test.useBdd)
        } else {
            setQuestions([])
            setTestName(null)
            setScoreMax(null)
            setTestUseBdd(null)
        }
    }, [test]);

    useEffect(() => {
        if (promo) {
            setPromoName(promo.promoName)
        } else {
            setPromoName(null)
        }
    }, [promo]);




    const handleChangeTestName = (e) => {
        setTestName(e.target.value)
    }

    const handleChangeScoreMax = (e) => {
        setScoreMax(e.target.value)
    }

    const handleChangeTestUseBdd = () => {
        setTestUseBdd(!testUseBdd)
    }

    const handleChangePromoName = (e) => {
        setPromoName(e.target.value)
    }

    const handleChangeTestId = (e) => {
        setTestId(e.target.value)
    }

    const handleChangePromoId = (e) => {
        setPromoId(e.target.value)
    }

    const addQuestion = (question) => {
        question.testId = testId
        questions.push(question)
        setQuestions(questions)
    }

    const deleteQuestion = (question) => {
        questions.splice(questions.indexOf((q) => { q.questionId === question.questionId }), 1)
        setQuestions(questions)
    }

    const updateQuestion = (question) => {
        questions[questions.indexOf((q) => { q.questionId === question.questionId })] = question
        setQuestions(questions)
    }

    const handleChangeQuestion = {
        addQuestion: addQuestion,
        deleteQuestion: deleteQuestion,
        updateQuestion: updateQuestion
    }


    const sendTest = () => {
        setLoading(true)
        setError(null)
        let methode = "POST"
        if (test) {
            methode = "PUT"
        }
        if (testName !== test.testName || scoreMax !== test.scoreMax || testUseBdd !== test.useBdd) {
            fetch((process.env.BASEURL || "https://challenge.delobeportfoliofrance.fr")+`/test${test ? '/' + testId : ''}`,
                {
                    method: methode,
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${jwt}`
                    },
                    body: JSON.stringify({
                        testName: testName,
                        scoreMax: scoreMax,
                        useBdd: testUseBdd
                    })
                })
                .then((res) => res.json())
                .then((data) => {
                    setLoading(false)
                    if (data) {
                        if (data.code) {
                            console.log("status", data)
                            setTestMessage(data.message);
                        } else {
                            if (data.id) {
                                setTestId(null)
                                setTestId(data.id)
                            }
                        }
                    }
                })
        }
    }


    const sendPromo = () => {
        setLoading(true)
        setError(null)
        let methode = "POST"
        if (promo) {
            methode = "PUT"
        }
        if (promoName !== promo.promoName) {
            fetch((process.env.BASEURL || "https://challenge.delobeportfoliofrance.fr")+`/promo${promo ? '/' + promoId : ''}`,
                {
                    method: methode,
                    headers: {
                        "Content-Type": "application/json",
                        'authorization': `Bearer ${jwt}`
                    },
                    body: JSON.stringify({
                        promoName: promoName
                    })
                })
                .then((res) => res.json())
                .then((data) => {
                    setLoading(false)
                    if (data) {
                        if (data.code) {
                            console.log("status", data)
                            setPromoMessage(data.message);
                        } else {
                            if (data.id) {
                                setPromo(null)
                                setPromoId(data.id)
                            }
                        }
                    }
                })
        }
    }



    const sendQuestion = () => {
        setLoading(true)
        Promise.all(questions.map(async(question) => {
            let methode = "POST"
            if (question.questionId) {
                methode = "PUT"
            }
            return fetch((process.env.BASEURL || "https://challenge.delobeportfoliofrance.fr")+`/question${question.questionId ? '/' + question.questionId : ''}`,
                {
                    method: methode,
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${jwt}`
                    },
                    body: JSON.stringify({
                        question: question.question,
                        type: question.type,
                        score: question.score,
                        testId: question.testId,
                        reponses: question.reponses
                    })
                })
                .then((res) => res.json())
                .then((data) => {
                    setLoading(false)
                    if (data) {
                        if (data.code) {
                            console.log("status", data)
                            setError(data.message);
                        } else {
                            if (data.id) {
                                question.questionId = data.id
                            }
                        }
                    }
                })
        }
        )).then(() => {
            setQuestions(questions)
        }
        )

    }

    const sendTestPromo = () => {

        if (testId !== "" && promoId !== "" && (testPromoId === "" || testPromoId === undefined)) {
            setLoading(true)
            fetch((process.env.BASEURL || "https://challenge.delobeportfoliofrance.fr")+`/testPromo`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${jwt}`
                    },
                    body: JSON.stringify({
                        testId: testId,
                        promoId: promoId
                    })
                })
                .then((res) => res.json())
                .then((data) => {
                    setLoading(false)
                    if (data) {
                        if (data.code) {
                            console.log("status", data)
                            setError(data.message);
                        } else {
                            if (data.id) {
                                setTestPromoId(data.id)
                            }
                        }
                    }
                })
        }
    }


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Grid container justifyContent="center" alignItems="center">
                <Card sx={{ height: "100%" }}>
                    <VuiBox display="flex" flexDirection="row" justifyContent="center">
                        <VuiBox display="flex" flexDirection="column" mr={2}>
                            <VuiTypography
                                variant="lg"
                                fontWeight="bold"
                                textTransform="capitalize"
                                color="white"
                                sx={({ breakpoints }) => ({
                                    [breakpoints.only("sm")]: {
                                        mb: "6px",
                                    },
                                })}
                            >
                                Test
                            </VuiTypography>
                            <VuiBox mb={2}>
                                <VuiBox mb={1} ml={0.5}>
                                    <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                                        Id Test
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
                                    <VuiInput value={testId} onChange={handleChangeTestId} type="number" placeholder="id test" fontWeight="500" disabled={test ? true : false} />
                                </GradientBorder>
                                {testMessage ?
                                    <VuiTypography variant="button" fontWeight="regular" color="text">
                                        {testMessage}
                                    </VuiTypography> : <></>}
                            </VuiBox>
                            <VuiBox mb={2}>
                                <VuiBox mb={1} ml={0.5}>
                                    <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                                        Test name
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
                                    <VuiInput value={testName} onChange={handleChangeTestName} type="string" placeholder="nom du test" fontWeight="500" />
                                </GradientBorder>
                            </VuiBox>
                            <VuiBox mb={2}>
                                <VuiBox mb={1} ml={0.5}>
                                    <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                                        Score max
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
                                    <VuiInput value={scoreMax} onChange={handleChangeScoreMax} type="number" placeholder="score" fontWeight="500" />
                                </GradientBorder>
                            </VuiBox>
                            <VuiBox display="flex" mb="14px">
                                <VuiBox mt={0.25}>
                                    <VuiSwitch color="info" checked={testUseBdd} onChange={handleChangeTestUseBdd} />
                                </VuiBox>
                                <VuiBox width="80%" ml={2}>
                                    <VuiTypography variant="button" fontWeight="regular" color="text">
                                        Utiliser une base de donnée
                                    </VuiTypography>
                                </VuiBox>
                            </VuiBox>


                            <VuiBox mt={4} mb={1}>
                                <VuiButton color="info" fullWidth onClick={sendTest} disabled={test?test.testName === testName && test.scoreMax === scoreMax && test.useBdd === testUseBdd:false}>
                                    {loading ? "LOADING" : test ? "UPDATE" : "CREATE"}
                                </VuiButton>
                            </VuiBox>
                        </VuiBox>
                        <VuiBox display="flex" flexDirection="column">

                            <VuiTypography
                                variant="lg"
                                fontWeight="bold"
                                textTransform="capitalize"
                                color="white"
                                sx={({ breakpoints }) => ({
                                    [breakpoints.only("sm")]: {
                                        mb: "6px",
                                    },
                                })}
                            >
                                Promo
                            </VuiTypography>
                            <VuiBox mb={2}>
                                <VuiBox mb={1} ml={0.5}>
                                    <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                                        Id Promo
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
                                    <VuiInput value={promoId} onChange={handleChangePromoId} type="number" placeholder="id promo" fontWeight="500" disabled={promo ? true : false} />
                                </GradientBorder>
                                {promoMessage ?
                                    <VuiTypography variant="button" fontWeight="regular" color="text">
                                        {promoMessage}
                                    </VuiTypography> : <></>}
                            </VuiBox>


                            <VuiBox mb={2}>
                                <VuiBox mb={1} ml={0.5}>
                                    <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                                        Promo name
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
                                    <VuiInput value={promoName} onChange={handleChangePromoName} type="string" placeholder="nom de la promo" fontWeight="500" />
                                </GradientBorder>
                            </VuiBox>

                            <VuiBox mt={4} mb={1}>
                                <VuiButton color="info" fullWidth onClick={sendPromo} disabled={promo?promo.promoName===promoName:false}>
                                    {loading ? "LOADING" : promo ? "UPDATE" : "CREATE"}
                                </VuiButton>
                            </VuiBox>
                        </VuiBox>
                    </VuiBox>
                    <VuiBox display="flex" flexDirection="row" m={2}>
                        <VuiBox display="flex" flexDirection="column" mr={2}>

                            <VuiTypography
                                variant="lg"
                                fontWeight="bold"
                                textTransform="capitalize"
                                color="white"
                                sx={({ breakpoints }) => ({
                                    [breakpoints.only("sm")]: {
                                        mb: "6px",
                                    },
                                })}
                                mb={2}
                            >
                                Questions
                            </VuiTypography>
                            <VuiBox display="flex" flexDirection="row" mr={2}>
                                {questions.map((question, index) => {
                                    return (
                                        <Question key={index} question={question} handleList={handleChangeQuestion} />
                                    );
                                })}
                                <Question key={'add'} question={null} handleList={handleChangeQuestion} />
                            </VuiBox>
                            <VuiBox mt={4} mb={1} flexDirection="column" >
                                <VuiButton color="info" fullWidth onClick={sendQuestion} disabled={JSON.stringify(questions) == JSON.stringify(questionsave)}>
                                    {loading ? "LOADING" : JSON.stringify(questions) !== JSON.stringify(questionsave) ? "SAVE" : "NO CHANGE"}
                                </VuiButton>
                            </VuiBox>

                            <VuiBox mt={4} mb={1} flexDirection="column" >
                                <VuiButton color="info" fullWidth onClick={sendTestPromo} disabled={testPromo ? true : false}>
                                    {loading ? "LOADING" : testPromo ? "ALREADY OPEN" : "OPEN"}
                                </VuiButton>
                            </VuiBox>

                        </VuiBox>
                    </VuiBox>
                </Card>
            </Grid>
            <Footer />
        </DashboardLayout>
    );
}
export default CreateTest;