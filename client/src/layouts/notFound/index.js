import VuiTypography from "components/VuiTypography";
import Card from "@mui/material/Card";
import VuiBox from "components/VuiBox";
import { Grid } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function notFound(props) {
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Grid container justifyContent="center" alignItems="center">
                <Card>

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
                                404
                            </VuiTypography>
                        </VuiBox>
                        <VuiBox mb={1} ml={0.5}>
                            <VuiTypography variant="button" color="white" >
                                Route not found
                            </VuiTypography>
                        </VuiBox>
                    </VuiBox>
                </Card>
            </Grid>
            <Footer />
        </DashboardLayout>);
}
export default notFound;