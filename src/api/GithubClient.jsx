const GITHUB_CLIENT_ID = 'eba9e3021a9925613f9f';
const GITHUB_CLIENT_SECRET = '2147827a6cabdcc154720881f3fc43370e2e433b';
const GITHUB_CALLBACK_URL = 'http://localhost:5173/login'

const githubAuth = async (code) => {
    try {

        const form = new FormData();
        form.append("client_id", GITHUB_CLIENT_ID);
        form.append("client_secret", GITHUB_CLIENT_SECRET);
        form.append("code", code);
        form.append("redirect_uri", GITHUB_CALLBACK_URL);

        const response = await fetch('https://github.com/login/oauth/access_token', {
            mode:'no-cors',
            method: 'POST',
            body: form
        })

        const data = await response.text()
        let params = new URLSearchParams(data);
        const access_token = params.get("access_token");

        console.log(access_token)
        // //Fetch the user's GitHub profile
        const userProfile = await fetch('https://api.github.com/user', {
          headers: {
            'Authorization': `Bearer ${access_token}`
          }
        });
  
        // //Handle the user profile data (e.g., store it in your database and log the user in)
        console.log(`Welcome, ${userProfile.data}!`);
        return {
            isAuth: true,
            email: userProfile.data.email
        };
      } catch (error) {
        console.log(error);
        return {
            isAuth: false
        };
      }
    

}

export default githubAuth