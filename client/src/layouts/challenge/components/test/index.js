/*!

=========================================================
* Challenge React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-react/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// @mui material components
import Card from "@mui/material/Card";
// import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

import { useHistory } from "react-router-dom";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import QuestionPassed from "../QuestionPassed";
import QuestionNotPassed from "../QuestionNotPassed";

// Billing page components

function Test(props) {

  const history = useHistory();
  const challenge = props.challenge;
  let note = 0;
  let questionsPassed = []
  let questionsNotPassed = []
  if (challenge?.responses && challenge?.responses?.length > 0) {
    let questions = [...challenge.test.questions]
    questions.map((question) => {
      let reponse = challenge.responses.find(resp => { return resp.id == question.questionId && resp.success })
      if (reponse) {
        questionsPassed.push({ ...question, ...reponse });
      }
    });
    questions.map((question) => {
      let reponse = challenge.responses.find(resp => { return resp.id == question.questionId && !resp.success })
      if (reponse) {
        questionsNotPassed.push({ ...question, ...reponse });
      }
    });
    note = questionsPassed.reduce((a, b) => a + (b.score || 0), 0);

  }
  const getQuestions = (questionsListe, isPassed) => {
    let QuestionComponent = isPassed ? QuestionPassed : QuestionNotPassed
    return questionsListe.map((question =>
      <QuestionComponent
        key={question.id}
        color={isPassed ? "success" : "error"}
        icon={isPassed ? "check" : "close"}
        name={question.questionText}
        description={question.value}
        value={(isPassed ? question.score : 0) + '/' + question.score}
      />
    ));
  }

  const redirectEdit = () => {
    console.log(challenge)
    history.push(`/ChallengeUpdate?id=${props.testPromoUserId}`);
  }

  let noteMax = challenge?.test?.scoreMax ?? 0
  if (!challenge) {
    return (
      <Card sx={{ height: "100%" }}>
        <VuiBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb="18px"
          sx={({ breakpoints }) => ({
            [breakpoints.down("lg")]: {
              flexDirection: "column",
            },
          })}
        >
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
           {props.loading?"Loading challenge ...": "No Challenge"}
          </VuiTypography>
          <VuiBox display="flex" alignItems="flex-start" onClick={redirectEdit} >
          <VuiTypography variant="button" color="text" fontWeight="small">
            <Icon>edit</Icon>
          </VuiTypography>
        </VuiBox>
        </VuiBox>
        <VuiBox mb={2}>
          <VuiTypography
            variant="caption"
            color="text"
            fontWeight="medium"
            textTransform="uppercase"
          >
            {props.error}
          </VuiTypography>
        </VuiBox>
      </Card>
    );
  }
  return (
    <Card sx={{ height: "100%" }}>
      <VuiBox
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb="18px"
        sx={({ breakpoints }) => ({
          [breakpoints.down("lg")]: {
            flexDirection: "column",
          },
        })}
      >
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
          Challenge :
        </VuiTypography>
        <VuiBox display="flex" alignItems="flex-start">
          <VuiTypography variant="button" color="text" fontWeight="regular">
            {note}/{noteMax}
          </VuiTypography>
        </VuiBox>
        <VuiBox display="flex" alignItems="flex-start" onClick={redirectEdit} >
          <VuiTypography variant="button" color="text" fontWeight="small">
            <Icon>edit</Icon>
          </VuiTypography>
        </VuiBox>
      </VuiBox>
      <VuiBox>
        <VuiBox mb={2}>
          <VuiTypography
            variant="caption"
            color="text"
            fontWeight="medium"
            textTransform="uppercase"
          >
            Tests réussie
          </VuiTypography>
        </VuiBox>
        <VuiBox
          component="ul"
          display="flex"
          flexDirection="column"
          p={0}
          m={0}
          sx={{ listStyle: "none" }}
        >
          {getQuestions(questionsPassed, true)}
        </VuiBox>
        {questionsNotPassed.length > 0 ?
          <>
            <VuiBox mt={1} mb={2}>
              <VuiTypography
                variant="caption"
                color="text"
                fontWeight="medium"
                textTransform="uppercase"
              >
                Tests en Cours
              </VuiTypography>
            </VuiBox>
            <VuiBox
              component="ul"
              display="flex"
              flexDirection="column"
              p={0}
              m={0}
              sx={{ listStyle: "none" }}
            >
              {getQuestions(questionsNotPassed, false)?.[0]}
            </VuiBox></> : <></>}
      </VuiBox>
    </Card>
  );
}

export default Test;
