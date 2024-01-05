import ProductFilter from "../components/ProductFilter";
import ProductList from "../components/ProductList";
import httpClient, { config } from "../api/HttpClient"
import { useQuery } from "react-query"
import { useState } from 'react'
import { Pagination } from '@mantine/core';
import dayjs from "dayjs";
import { find } from 'lodash'

const getProducts = async () => {
    const { data, status } = await httpClient.get('/products')
    console.log('--status', status)
    return data
}

const getProductsWithPaging = async (page, conds) => {
    console.log('conds passed', conds)
    const from = find(conds, i => i.startsWith('from')) || null
    const to = find(conds, i => i.startsWith('to')) || null
    const description = find(conds, i => i.startsWith('description')) || null

    const { data } = await httpClient.post('/products/paging', {
        // from: '2024-01-01T00:00:00', to: '2024-01-07T23:00:00', 
        // from: null, 
        // to: null,
        // description: search.trim() === '' ? null : search.trim(),
        from: from !== null ? dayjs(from.split('=')[1]).format('YYYY-MM-DDTHH:mm:ss') : null, 
        to: to !== null ? dayjs(to.split('=')[1]).format('YYYY-MM-DDTHH:mm:ss') : null, 
        description: description !== null ? description.split('=')[1] : null, 
        page: page - 1,
        size: 3
    })
    console.log(data)
    return data
}

const ProductsPage = () => {
    const now = dayjs().format('YYYY-MM-DD')
    const [page, setPage] = useState(1)
    const [conds, setConds] = useState([`from=${now}T00:00:00`])
    const { data, error, isLoading } = useQuery({
        queryKey: ['products', page, conds],
        queryFn: () => getProductsWithPaging(page, conds),
        // ...config
    })

    const handleSearching = (value) => {
       console.log('searching', value)
       setPage(1)
       setConds(value)
       
       
    }

  
    return ( <>
    <ProductFilter initialValue={conds} handleSearch={(value) => handleSearching(value)}/>
    <br />
    {
        isLoading ? 
            (<div>Fetching products...</div>) : 
            error ? 
                (<span>Product not found</span>) : 
                (
                <>
                <ProductList products={data.content}/>
                <Pagination total={data.totalPages} onChange={setPage} value={page}/>
                </>)
    }
    </> );
}
 
export default ProductsPage;