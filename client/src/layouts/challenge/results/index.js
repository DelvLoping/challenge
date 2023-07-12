import Table from "examples/Tables/Table";
import { useEffect, useState } from "react";
import VuiBox from "components/VuiBox";
import Card from "@mui/material/Card";
import VuiTypography from "components/VuiTypography";
import Icon from "@mui/material/Icon";
import { useHistory } from "react-router-dom";


function Results(props){

    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);
    const history = useHistory();

    useEffect(() => {
        if(props.challenge)
        {
            let tempRows=[];
            setColumns([{name:"Nom", align: "left" },{name:"Prenom", align: "left" },{name:"Email", align: "left" },{name:"Serveur IP", align: "left" },{name:"Score", align: "center" }])
            props.challenge.map((challenge) => {
                let score = 0;
                challenge.reponsesBd.map((response) => { 
                        score += response.score;
                })
                tempRows.push({"Nom":challenge.user.familyName,"Prenom":challenge.user.givenName,"Email":challenge.user.email,"Serveur IP":challenge.urlServer,"Score":score})
            });
            setRows(tempRows);

        }
    }, [props.challenge]);

    const redirectEdit = () => {
      history.push(`/TestUpdate?id=${props.testPromoUserId}`);
    }

    return (
        <>
        <Card >
        <VuiBox
              sx={{
                "& th": {
                  borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                    `${borderWidth[1]} solid ${grey[700]}`,
                },
                "& .MuiTableRow-root:not(:last-child)": {
                  "& td": {
                    borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                      `${borderWidth[1]} solid ${grey[700]}`,
                  },
                },
              }}
            >
                <VuiBox display="flex" alignItems="flex-start" onClick={redirectEdit} >
          <VuiTypography variant="button" color="text" fontWeight="small">
            <Icon>edit</Icon>
          </VuiTypography>
        </VuiBox>
        <Table columns={columns} rows={rows} />
        </VuiBox>
        </Card>
        </>
    );
}
export default Results;