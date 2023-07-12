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

import { useState, useEffect } from "react";

// react-router-dom components
import { Link, useHistory, useLocation } from "react-router-dom";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiInput from "components/VuiInput";
import VuiButton from "components/VuiButton";
import VuiSwitch from "components/VuiSwitch";
import GradientBorder from "examples/GradientBorder";

// Vision UI Dashboard assets
import radialGradient from "assets/theme/functions/radialGradient";
import palette from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgSignIn from "assets/images/signInImage.png";
import { setJwtCookie } from "CookieService";
import { setJWT } from "context";
import { useVisionUIController } from "context";

function SignIn() {
  const [controller, dispatch] = useVisionUIController();
  const history = useHistory();
  const location = useLocation();
  const [email, setEmail] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jwtParams, setJwtParams] = useState(null);
  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
    resetState()
  };

  const resetState = () => {
    setError(null);
    setSuccess(null);
  }
  const sendMagicLink = () => {
    resetState();
    setLoading(true);
    console.log(email);
    fetch((process.env.BASEURL || "https://challenge.delobeportfoliofrance.fr")+"/auth/magic?email=" + email, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json',
      },
    }).then((res) => {
      console.log(res);
      setLoading(false);
      if (res.ok) {
        console.log("ok");
        setSuccess("Check your email for the magic link");
      } else {
        console.log("not ok");
        if (res.code === 404) {
          setError("User not found");
        } else if (res.code === 400) {
          setError("Bad request");
        } else {
          setError("Something went wrong");
        }
      }
    });
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setJwtParams(searchParams.get('jwt'));
  }, [location]);

  useEffect(() => {
    console.log('jwtParams:', jwtParams);

    if (jwtParams) {
      fetch((process.env.BASEURL || "https://challenge.delobeportfoliofrance.fr")+"/auth/login?jwt=" + jwtParams, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Accept': 'application/json',
        },
      }).then(response => response.json()).then((res) => {

        console.log(res);
        if (res.access) {
          console.log("ok");
          setSuccess("Authentificaton success");
          setJwtCookie(res.access);
          setJWT(dispatch, "get");
          history.push(res.redirectTo);
        } else {
          console.log("not ok");
          if (res.code === 404) {
            setError("User not found");
          } else if (res.code === 400) {
            setError("Bad request");
          } else {
            setError("Something went wrong");
          }
        }
      });
    }
    // Faites ce que vous voulez avec la valeur de l'email ici
  }, [jwtParams]);

  return (
    <CoverLayout
      title="Nice to see you!"
      color="white"
      description={!success ? "Enter your email to sign in" : ""}
      premotto=""
      motto=""
      image={bgSignIn}
    >
      {!success ? !jwtParams ?
        <VuiBox>
          <VuiBox mb={2}>
            <VuiBox mb={1} ml={0.5}>
              <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                Email
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
              <VuiInput value={email} onChange={handleChangeEmail} type="email" placeholder="Your email..." fontWeight="500" />
            </GradientBorder>
          </VuiBox>

          <VuiBox mt={4} mb={1}>
            <VuiButton color="info" fullWidth onClick={sendMagicLink}>
              {!loading ? "SEND MAGIC LINK" : "LOADING"}
            </VuiButton>
          </VuiBox>
        </VuiBox>
        :
        <VuiBox mt={4} mb={1}>
          <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
            Checking magic link...
          </VuiTypography>
        </VuiBox>
        :
        <VuiBox mt={4} mb={1}>
          <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
            {success}
          </VuiTypography>
        </VuiBox>}

      <VuiBox mt={4} mb={1}>
        <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
          {error}
        </VuiTypography>
      </VuiBox>
    </CoverLayout>
  );
}

export default SignIn;
