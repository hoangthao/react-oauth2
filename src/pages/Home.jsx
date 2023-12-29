import { useEffect } from "react";
import axios from "axios";

const Home = () => {

    useEffect(() => {
        const fetchHome = async () => {
            const resp = await axios.get('http://localhost:8080')
            console.log(resp)
        }
        const fetchProducts1 = async () => {
            const auth = {
                username: "user",
                password: "user"
            }
            const resp = await axios.get('http://localhost:8080/products', {auth})
            console.log(resp)
        }
        const fetchProducts2 = async () => {
            const encoded = btoa('user:user')
            const headers = {
                'Authorization': `Basic ${encoded}`
            }
            const resp = await axios.get('http://localhost:8080/products', {headers})
            console.log(resp)
        }
        fetchHome()
        fetchProducts1()
        fetchProducts2()
    }, [])

    return ( <>Hello home</> );
}
 
export default Home;