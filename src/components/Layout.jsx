import { Link, Outlet } from "react-router-dom";
import { AppShell, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from "../hooks/useAuth";

const Layout = () => {

    const { authed, logout } = useAuth()
    const [opened, { toggle }] = useDisclosure();
    const tmp = () => ( <>
    
    <nav>
        <Link to={"/"}>Home</Link> &nbsp;|&nbsp;
        <Link to={"/products-1"}>Products</Link> &nbsp;|&nbsp;
        <Link to={"/products-2"}>Products Infinite</Link> &nbsp;|&nbsp;
        <Link to={"/products-3"}>Products Search</Link> &nbsp;|&nbsp;
        <Link to={"/products-4"}>Products Filter</Link> &nbsp;|&nbsp;
        <Link to={"/products-5"}>Products InfiniteFilter</Link> &nbsp;|&nbsp;
        <Link to={"/profile"}>Profile</Link> &nbsp;|&nbsp;
        {
            !authed?.isAuthed ? <Link to={"/login"}>Login</Link> :
            (
            <>
                <span>Welcome {authed.email}! </span>
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

    return (
        <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 200,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Burger
          opened={opened}
          onClick={toggle}
          hiddenFrom="sm"
          size="sm"
        />
        <div>Logo 
          &nbsp;|&nbsp; <Link to={"/english"}>English</Link>
          &nbsp;|&nbsp; <Link to={"/interview"}>Interview</Link>
        
        </div>
       
      </AppShell.Header>
      <Outlet/>
      
    </AppShell>
    )
}
 
export default Layout;