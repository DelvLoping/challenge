import { useHistory, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const { default: CreateTest } = require("../createTest");

function UpdateTest(props) {
    const history = useHistory();
    const location = useLocation();
    const [testPromo, setTestPromo] = useState(null);


    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        let id = searchParams.get('id');
        console.log(props.lastProps,id);
        if (props.lastProps && id) {
            let testPromo = props.lastProps.find((testPromoItem) => testPromoItem.testPromoId == id);
            if (testPromo) {
                setTestPromo(testPromo)
            } else {
                history.push('/dashboard')
            }
        }
    }, [props.lastProps]);

    return (
        <>
            {testPromo ?
                <CreateTest testPromo={testPromo} />
                :
                <></>
            }
        </>
    );
}
export default UpdateTest;