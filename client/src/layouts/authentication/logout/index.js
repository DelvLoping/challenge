
import { removeJwtCookie } from "CookieService";
import { setJWT } from "context";
import { useVisionUIController } from "context";

function Logout() {
    const [controller, dispatch] = useVisionUIController();
    removeJwtCookie();
    setJWT(dispatch, "reset");

    return (
        <></>);
}
export default Logout;