import { useQuery } from "react-query"
import httpClient from "../../../api/HttpClient"

const getProducts = async () => {
    const { data } = await httpClient.get('/products')
    return data
}

export default function useProducts() {
    return useQuery('products', getProducts)
}