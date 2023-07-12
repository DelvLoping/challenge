import { useHistory, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const { default: CreateChallenge } = require("../createChallenge");

function UpdateChallenge(props) {
    const history = useHistory();
    const location = useLocation();
    const [testPromoUser, setTestPromoUser] = useState(null);


    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        let id = searchParams.get('id');
        console.log(props.lastProps,id);
        if (props.lastProps && id) {
            let testPromoUser = props.lastProps.find((testPromoUserItem) => testPromoUserItem.testPromoUserId == id);
            if (testPromoUser) {
                setTestPromoUser(testPromoUser)
            } else {
                history.push('/dashboard')
            }
        }
    }, [props.lastProps]);

    return (
        <>
            {testPromoUser ?
                <CreateChallenge testPromoUser={testPromoUser} />
                :
                <></>
            }
        </>
    );
}
export default UpdateChallenge;