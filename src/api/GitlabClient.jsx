import axios from "axios";

const GITLAB_CLIENT_ID = '901047c70aa238a7ab08894598c3b7cdff46cb055546a26e8107cbcb76d20cf5';
const GITLAB_CLIENT_SECRET = 'gloas-9c25e9db263e1a5049078d57959a9bb73a21b085e25dc791243cbd08133db9db';
const GITLAB_CALLBACK_URL = 'http://localhost:5173/login'

const gitlabAuth = async (code) => {
    try {
        const resp = await axios.post('https://gitlab.com/oauth/token', {
            client_id: GITLAB_CLIENT_ID,
            client_secret: GITLAB_CLIENT_SECRET,
            code,
            grant_type: 'authorization_code',
            redirect_uri: GITLAB_CALLBACK_URL,
          })
  
          //console.log(resp)
        const accessToken = resp.data.access_token;
  
        // Fetch the user's GitLab profile
        const userProfile = await axios.get('https://gitlab.com/api/v4/user', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          }
        });
  
        // Handle the user profile data (e.g., store it in your database and log the user in)
        //console.log(userProfile.data)
        //console.log(`Welcome, ${userProfile.data.name}!`);
        return {
            isAuth: true,
            email: userProfile.data.email
          };
      } catch (error) {
        console.error(error);
        return {
            isAuth: false
        };
      }
      
}

export default gitlabAuth