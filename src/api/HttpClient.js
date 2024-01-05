import axios from "axios";

const encoded = btoa('user:user')

const httpClient = axios.create({
    baseURL: "http://localhost:8080",
    // validateStatus: (status) => {
    //   console.log('test...', status)
    //   return true;
    // },
    headers: {
      "Content-type": "application/json",
      'Authorization': `Basic ${encoded}`
    },
});

export const config = {
  retry: (failureCount, error) => {
      console.log('---eorr', error.code, failureCount)
      return error.code === 'ERR_NETWORK' && failureCount <= 0 ? true : false
  },
  //retryDelay: retryCount => retryCount === 0 ? 1000 : 3000,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
}

export default httpClient;