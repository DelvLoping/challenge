/*!

=========================================================
* Challenge React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-react/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the software.

*/
import { IoAdd, IoAddCircle, IoClipboardSharp, IoLogOut } from "react-icons/io5";
import { useState, useEffect, useMemo } from "react";

// react-router components
import { Route, Switch, Redirect, useLocation, useHistory } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";

// Vision UI Dashboard React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Vision UI Dashboard React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Vision UI Dashboard React routes
import { routesInitial, addRoutes, removeRoutes, getDefaultRoutes } from "routes";

// Vision UI Dashboard React contexts
import { useVisionUIController, setMiniSidenav, setOpenConfigurator, setUser, setRoutes } from "context";


// get Cookie 
import { getJwtCookie, removeJwtCookie } from './CookieService';
import Logout from "layouts/authentication/logout";
import Billing from "layouts/billing";
import { HideRoutes } from "routes";
import Challenge from "layouts/challenge";
import ChallengeResult from "layouts/challenge";
import CreateChallenge from "layouts/challenge/createChallenge";
import notFound from "layouts/notFound";
import UpdateChallenge from "layouts/challenge/updateChallenge";
import CreateTest from "layouts/challenge/createTest";
import UpdateTest from "layouts/challenge/updateTest";


export default function App() {
  const History = useHistory();
  const [controller, dispatch] = useVisionUIController();
  const { miniSidenav, direction, layout, openConfigurator, sidenavColor } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  const [testPromos, setTestPromos] = useState(null);

  const jwt = controller.jwt;
  const user = controller.user;
  const routes = controller.routes;
  const getCurrentUser = () => {
    fetch((process.env.BASEURL || "https://challenge.delobeportfoliofrance.fr")+'/currentUser', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + jwt
      }

    }).then((response) => response.json()).then((data) => {
      console.log(data);
      setUser(dispatch, data);
    }).catch((error) => {
      console.log(error);
    });
  }
  useEffect(() => {
    if (user && user?.profile?.profileCode > 1) {

      fetch((process.env.BASEURL || "https://challenge.delobeportfoliofrance.fr")+'/test_promo/open', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'authorization': 'Bearer ' + jwt
        }
      }).then((response) => response.json()).then((data) => {
        if (data.code) {
          console.log(data);
        } else {
          console.log(data);
          setTestPromos(data);
        }
      }).catch((error) => {
        console.log(error);
      });
    }
  }, [user]);




  useEffect(() => {
    if (user) {
      let routes = routesInitial;
      let icon = null;
      routes = HideRoutes(routes, routes.length - 1);
      routes = HideRoutes(routes, routes.length - 2);
      let index = 1;
      if (user?.challenges || testPromos) {
        icon = <IoClipboardSharp size="15px" color="inherit" />;
        let liste = user.challenges
        if (testPromos) {
          liste = testPromos;
        }
        liste.map((challenge) => {
          routes = addRoutes(routes, challenge.test.testName + ' ' + challenge.promo.promoName, (testPromos ? challenge.testPromoId : challenge.testPromoUserId), "/" + challenge.test.testName + '/' + challenge.promo.promoName, (testPromos ? ChallengeResult : Challenge), icon, index, (testPromos ? challenge.testPromoId : challenge.testPromoUserId));
          index++;
        });

      }
      let create = "Ajouter challenge"
      let update = "Modifier challenge"
      let createRouteName = "addChall"
      let updateRouteName = "updateChall"
      let createRoute = "/ChallengeInscription"
      let updateRoute = "/ChallengeUpdate"
      let createComponent = CreateChallenge
      let updateComponent = UpdateChallenge
      let liste = user.challenges;
      if (testPromos) {
        create = "Ajouter test"
        update = "Modifier test"
        createRouteName = "addTest"
        updateRouteName = "updateTest"
        createRoute = "/OpenTest"
        updateRoute = "/TestUpdate"
        createComponent = CreateTest
        updateComponent = UpdateTest
        liste = testPromos;
      }
        icon = <IoAddCircle size="15px" color="inherit" />;
        routes = addRoutes(routes, create, createRouteName, createRoute, createComponent, icon, index);
        routes = addRoutes(routes, update, updateRouteName, updateRoute, updateComponent, icon, index + 1, null, liste);
        routes = HideRoutes(routes, index + 1);
      
      icon = <IoLogOut size="15px" color="inherit" />;
      routes = addRoutes(routes, "Sign Out", "signOut", "/authentication/sign-in", Logout, icon, routes.length);
      setRoutes(dispatch, routes);

    } else {
      setRoutes(dispatch, getDefaultRoutes());
    }

  }, [user?.challenges, testPromos]);




  useEffect(() => {

    console.log('pathname : ', pathname)
    if (!jwt) {
      if (pathname !== '/authentication/sign-up' && pathname !== '/authentication/sign-in') {

        History.push('/authentication/sign-in');
      }
    }

  }, [pathname]);

  useEffect(() => {
    console.log("jwt change : ", jwt)
    if (jwt) {
      if (!user) {
        getCurrentUser();
      }
    } else {
      if (user) {
        setUser(dispatch, null);
      }
    }
  }, [jwt]);

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route path={route.route} render={() => <route.component lastProps={route.lastProps} testPromoUserId={route?.id} pathName={route.route} />} key={route.key} />;
      }

      return null;
    });

  const configsButton = (
    <VuiBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.5rem"
      height="3.5rem"
      bgColor="info"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="white"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="default" color="inherit">
        settings
      </Icon>
    </VuiBox>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand=""
            brandName="Challenge"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          {configsButton}
        </>
      )}
      {layout === "vr" && <Configurator />}
      <Switch>
        {getRoutes(controller.routes)}
        <Route component={notFound} />
        <Redirect from="/" to="/dashboard" />
      </Switch>
    </ThemeProvider>
  );
}
