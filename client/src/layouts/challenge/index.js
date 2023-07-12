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
import Grid from "@mui/material/Grid";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";

// Vision UI Dashboard React components
import MasterCard from "examples/Cards/MasterCard";
// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Test from "./components/test";
import { useEffect, useState } from "react";
import { getJwtCookie } from "CookieService";
import { useVisionUIController } from "context";
import Results from "./results";

// Billing page components

function Challenge(props) {

  const [challenge, setChallenge] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [controller, dispatch] = useVisionUIController();
  const jwt = controller.jwt;
  console.log(props)

  useEffect(() => {
    let pathprof = "";
    if (controller.user.profile.profileCode > 1) {
      pathprof = "/reponses";
    }
    if (props.testPromoUserId && props.pathName) {
      setError(null);
      setChallenge(null);
      setLoading(true);
      fetch((process.env.BASEURL || "https://challenge.delobeportfoliofrance.fr")+`/challenge${pathprof + props.pathName}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${jwt}`
          }
        })
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
          if (data) {
            if (data.code) {
              console.log("status", data)
              setError(data.message);
            } else {
              if (pathprof !== "") {
                if (data.total > 0) {
                  setChallenge(data.rows);
                }
              } else {
                console.log(data);
                setChallenge(data);
              }
            }
          } else {
            console.log("no data create one")
          }
        });
    }
  }, [props.pathName]);



  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container justifyContent="center" alignItems="center">

        <VuiBox my={8}>

          {controller.user.profile.profileCode > 1 ?
            <Results {...props} loading={loading} challenge={challenge} error={error} />
            :
            <Test {...props} loading={loading} challenge={challenge} error={error} />
          }

        </VuiBox>
      </Grid>
      <Footer />
    </DashboardLayout>
  );
}

export default Challenge;
