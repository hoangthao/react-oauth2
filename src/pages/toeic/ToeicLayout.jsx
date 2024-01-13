import { AppShell } from '@mantine/core';
import { Link, Outlet } from "react-router-dom";

const ToeicLayout = () => {
    return ( <>
    
    <AppShell.Navbar p="md">
        <Link to={"/toeic/page-1"}>Toeic ETS</Link> <br />
    </AppShell.Navbar>
    <AppShell.Main><Outlet/></AppShell.Main>
    
    </> );
}
 
export default ToeicLayout;