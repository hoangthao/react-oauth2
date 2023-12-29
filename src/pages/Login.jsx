import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate, useNavigate } from "react-router-dom";

const GITHUB_CLIENT_ID = 'eba9e3021a9925613f9f';
const githubOAuthURL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user`;

const GITLAB_APP_ID = '901047c70aa238a7ab08894598c3b7cdff46cb055546a26e8107cbcb76d20cf5';
const GITLAB_CALLBACK_URL = 'http://localhost:5173/login';
const gitlabOAuthURL = `https://gitlab.com/oauth/authorize?client_id=${GITLAB_APP_ID}&redirect_uri=${encodeURIComponent(GITLAB_CALLBACK_URL)}&response_type=code&scope=read_user`;


const Login = () => {

    const { authed, login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const code = urlParams.get('code');
        if (code) {
            login(code, () => {
                navigate('/', {replace: true})
            });
        }
    }, [authed])

    if (authed) {
        console.log('signed in already')
        return <Navigate to={'/'} replace/>
    }

    return ( <>
    <a href={githubOAuthURL}>Login with github</a>
    
    <br />
    <a href={gitlabOAuthURL}>Login with gitlab</a>
    </> );
}
 
export default Login;