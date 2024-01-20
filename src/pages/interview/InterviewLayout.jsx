import { AppShell } from "@mantine/core";
import { Link, Outlet } from "react-router-dom";

const InterviewLayout = () => {
    return ( <> <AppShell.Navbar p="md">
    <Link to={"essential"}>Essential</Link> <br />
    <Link to={"amazon"}>Amazon</Link> <br />
</AppShell.Navbar>
<AppShell.Main><Outlet /></AppShell.Main>
</>  );
}
 
export default InterviewLayout;