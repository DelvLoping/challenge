
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


function CreateChallenge(props) {

    const publicKey ="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCxDKaFOjr47maZJ7ljZJmkmX86o9cQn2i6hhGw+eWDAF1x1u559Xnh/nIposJRHxqVjWBeXFSL/LGcrEpLJqt7LG6z/JK1DVjDD5Yj10Fsq93jM0pkciYr+fnuHSN/HL2SZqe7vWzg44+HmEmEsWCtrGJzB370E4pOXQTYDc1lVAi3nNxNhTiaaKN+YgEYqJgii3ezLABeqk9zPI2D8bMa7ypDmD9k4M0xeK9ZPaKq9+3Lp2VxAKruHSYmFp0iBehCgzTTjBg7VV32ppckUqkMsokl/H3b+IwnvGMaLChGqI41TbMDZAhUObjuLprd2mM3BLKg8KbCp7xIa1Og8IMpQzbJQjwUtvyjvxjmKRPLYq+lLkuOJs/QXB5dEQ4w5ZkzPjCBhptMZQvGYEO9XFaYHf6dLNK5rVrjRekojnQPfgiKub1SwhNqU//LktVro3WiuCEdosW9bWH5qvHtElnA2MZmnvSgY8r4Ygf6H+eJzNCxKiuC2okNS6pYMJof+g0= root@e72eb7a0e7f1"
    
    useEffect(() => {
        console.log(props.testPromoUser)
        if (props.testPromoUser) {
            setTestPromo(props.testPromoUser.testPromo);
            setIdTestPromo(props.testPromoUser.testPromoUserId)
            setTest(props.testPromoUser.test);
            setIsAlreadyOpen(false);
            setError(null);
            setUrlServer(props.testPromoUser.urlServer);
            setUserServer(props.testPromoUser.userServer);
            setPasswordServer(props.testPromoUser.passwordServer);
            setBdUserServer(props.testPromoUser.bdUserServer);
            setBdPasswordServer(props.testPromoUser.bdPasswordServer);
        }
        console.log(this)
    }, [props.testPromoUser]);

    const History = useHistory();
    const [idTestPromo, setIdTestPromo] = useState("");
    const location = useLocation();
    const [controller, dispatch] = useVisionUIController();
    const [testPromo, setTestPromo] = useState(null)
    const [test, setTest] = useState(null)
    const user = controller.user
    const jwt = controller.jwt;
    const [urlServer, setUrlServer] = useState("");
    const [userServer, setUserServer] = useState("");
    const [passwordServer, setPasswordServer] = useState("");
    const [bdUserServer, setBdUserServer] = useState("");
    const [bdPasswordServer, setBdPasswordServer] = useState("");
    const [isAlreadyOpen, setIsAlreadyOpen] = useState(false);
    const [error, setError] = useState(null);

    const handleChangeUrlServer = (e) => {
        setUrlServer(e.target.value);
    };

    const handleChangeUserServer = (e) => {
        setUserServer(e.target.value);
    };

    const handleChangePasswordServer = (e) => {
        setPasswordServer(e.target.value);
    };

    const handleChangeBdUserServer = (e) => {
        setBdUserServer(e.target.value);
    };

    const handleChangeBdPasswordServer = (e) => {
        setBdPasswordServer(e.target.value);
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        let id = searchParams.get('idTestPromo');
        if (id) {
            setIdTestPromo(id);
        }
    }, [location]);

    useEffect(() => {
        if (idTestPromo && !props.testPromoUser) {
            fetch((process.env.BASEURL || "https://challenge.delobeportfoliofrance.fr")+"/test_promo/" + idTestPromo, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json',
                    "authorization": "Bearer " + jwt,
                },
            }).then((res) => res.json())
                .then((res) => {
                    if (res.code) {
                        console.log(res.message);
                        setTestPromo(null);
                    } else {
                        console.log(res);
                        setTestPromo(res);
                        setIsAlreadyOpen(checkIfTestPromoUserAlreadyExist(res.testPromoId));
                    }
                }
                ).catch((err) => {
                    console.log(err);
                    setTestPromo(null);

                });
        }
    }, [idTestPromo])

    const checkIfTestPromoUserAlreadyExist = (id) => {
        let res = false;
        let count = 0;
        while (count < user.challenges.length && !res) {
            if (user.challenges[count].testPromoId === id) {
                res = true;
            }
            count++;
        }
        return res;
    }

    useEffect(() => {
        if (testPromo?.testId && !isAlreadyOpen && !props.testPromoUser) {

            console.log(testPromo);
            fetch((process.env.BASEURL || "https://challenge.delobeportfoliofrance.fr")+"/test/" + testPromo.testId, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json',
                    "authorization": "Bearer " + jwt,
                },
            }).then((res) => res.json())
                .then((res) => {
                    if (res.code) {
                        console.log(res.message);
                        setTest(null);
                    } else {
                        console.log(res);
                        setTest(res);
                    }
                }
                ).catch((err) => {
                    console.log(err);
                    setTest(null);
                });
        }
    }, [testPromo])


    const handleChangeIdTestPromo = (e) => {
        setIdTestPromo(e.target.value);
    };

    const sendTestPromo = () => {
        setError(null);
        let body = {}
        if (!props.testPromoUser) {
            body.userId = user.userId;
        }
        body.testPromoId = parseInt(idTestPromo);
        body.urlServer = urlServer;
        body.userServer = userServer;
        body.passwordServer = passwordServer;
        body.bdUserServer = bdUserServer;
        body.bdPasswordServer = bdPasswordServer;
        let methode = props.testPromoUser ? "PUT" : "POST";
        let uri = props.testPromoUser ? "/" + props.testPromoUser.testPromoUserId : "";
        fetch((process.env.BASEURL || "https://challenge.delobeportfoliofrance.fr")+"/test_promo_user" + uri, {
            method: methode,
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
                'authorization': 'Bearer ' + jwt
            },
            body: JSON.stringify(body),
        }).then((res) => res.json())
            .then((res) => {
                if (res.code) {
                    console.log(res.message);
                    setError(res.message);
                } else {
                    fetch((process.env.BASEURL || "https://challenge.delobeportfoliofrance.fr")+"/currentUser", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            'Accept': 'application/json',
                            'authorization': 'Bearer ' + jwt
                        },
                    }).then((res) => res.json())
                        .then((res) => {
                            if (res.code) {
                                console.log(res.message);
                                setError(res.message);
                            } else {
                                console.log(res);
                                setUser(dispatch, res);
                                History.push('/dashboard');
                            }
                        }
                        ).catch((err) => {
                            console.log(err);
                        }
                        );
                }
            }).catch((err) => {
                console.log(err);
                setError(err);
            });
    }
    let send = idTestPromo !== "" && !isAlreadyOpen && urlServer !== "" && userServer !== "" && passwordServer !== "" && ((test?.useBdd && bdUserServer !== "" && bdPasswordServer !== "") || !test?.useBdd);
    if (props.testPromoUser) {
        send = send && (urlServer !== props.testPromoUser.urlServer || userServer !== props.testPromoUser.userServer || passwordServer !== props.testPromoUser.passwordServer || bdUserServer !== props.testPromoUser.bdUserServer || bdPasswordServer !== props.testPromoUser.bdPasswordServer);
    }
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Grid container justifyContent="center" alignItems="center">
                <Card sx={{ height: "100%" }}>

                    <VuiBox my={8}>

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
                                {props.testPromoUser ? "UPDATE " : ""}CHALLENGE INSCRIPTION
                            </VuiTypography>
                        </VuiBox>
                        <VuiBox mb={2}>
                            <VuiBox mb={1} ml={0.5} variant="button">
                                <VuiTypography color="white" fontWeight="medium">
N'oublier pas de me donnér accès avec ma public key : {publicKey}
                                </VuiTypography>
                            </VuiBox>
                            <VuiBox mb={1} ml={0.5}>
                                <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                                    Id Test / Promo
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
                                <VuiInput value={idTestPromo} onChange={handleChangeIdTestPromo} type="number" placeholder="id test_promo" fontWeight="500" disabled={props.testPromoUser ? true : false} />
                            </GradientBorder>
                        </VuiBox>
                        {isAlreadyOpen ?
                            <VuiBox mb={1} ml={0.5}>
                                <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                                    Test already open
                                </VuiTypography>
                            </VuiBox>
                            :
                            test ? <>
                                <VuiBox mb={2}>
                                    <VuiBox mb={1} ml={0.5}>
                                        <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                                            Url Server
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
                                        <VuiInput value={urlServer} onChange={handleChangeUrlServer} type="string" placeholder="1.1.1.1" fontWeight="500" />
                                    </GradientBorder>
                                </VuiBox>

                                <VuiBox mb={2}>
                                    <VuiBox mb={1} ml={0.5}>
                                        <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                                            User Server
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
                                        <VuiInput value={userServer} onChange={handleChangeUserServer} type="string" placeholder="challenge" fontWeight="500" />
                                    </GradientBorder>
                                </VuiBox>

                                <VuiBox mb={2}>
                                    <VuiBox mb={1} ml={0.5}>
                                        <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                                            Password Server
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
                                        <VuiInput value={passwordServer} onChange={handleChangePasswordServer} type="password" placeholder="challenge" fontWeight="500" />
                                    </GradientBorder>
                                </VuiBox>

                                {test.useBdd ?
                                    <>                        <VuiBox mb={2}>
                                        <VuiBox mb={1} ml={0.5}>
                                            <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                                                Bdd User Server
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
                                            <VuiInput value={bdUserServer} onChange={handleChangeBdUserServer} type="string" placeholder="" fontWeight="500" />
                                        </GradientBorder>
                                    </VuiBox>

                                        <VuiBox mb={2}>
                                            <VuiBox mb={1} ml={0.5}>
                                                <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                                                    Bdd Password Server
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
                                                <VuiInput value={bdPasswordServer} onChange={handleChangeBdPasswordServer} type="password" placeholder="" fontWeight="500" />
                                            </GradientBorder>
                                        </VuiBox></> : <></>}

                                <VuiBox mt={4} mb={1}>
                                    <VuiButton color="info" fullWidth onClick={sendTestPromo} disabled={!send}>
                                        {props.testPromoUser ? "UPDATE" : "CREATE"}
                                    </VuiButton>
                                </VuiBox>
                                {error ?
                                    <VuiBox mt={4} mb={1}>
                                        <VuiTypography variant="button" color="error" fontWeight="medium">
                                            {error}
                                        </VuiTypography>
                                    </VuiBox> : <></>}</>
                                :
                                <VuiBox mb={1} ml={0.5}>
                                    <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                                        No Test open
                                    </VuiTypography>
                                </VuiBox>

                        }
                    </VuiBox>
                </Card>
            </Grid>
            <Footer />
        </DashboardLayout>
    );
}
export default CreateChallenge;