import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Layout = () => {

    const { authed, logout, email } = useAuth()

    return ( <>
    
    <nav>
        <Link to={"/"}>Home</Link> &nbsp;|&nbsp;
        {
            !authed ? <Link to={"/login"}>Login</Link> :
            (
            <>
                <span>Welcome {email}! </span>
                <Link to={"#"} onClick={logout}>Logout</Link>
            </>
            )
        }
        
    </nav>
    <hr />
    <div>
        <Outlet/>
    </div>

    </> );
}
 
export default Layout;