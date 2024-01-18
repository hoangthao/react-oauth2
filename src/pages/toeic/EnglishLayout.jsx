import { AppShell } from '@mantine/core';
import { Link, Outlet } from "react-router-dom";

const EnglishLayout = () => {
    return (<>

        <AppShell.Navbar p="md">
            <Link to={"/english/toeic"}>Toeic Practice</Link> <br />
            <Link to={"/english/test"}>Test</Link> <br />
        </AppShell.Navbar>
        <AppShell.Main><Outlet /></AppShell.Main>

    </>);
}

export default EnglishLayout;