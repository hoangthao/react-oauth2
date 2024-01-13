import { useState } from "react"
import httpClient from "../../api/HttpClient"
import { useInfiniteQuery } from "react-query"
import dayjs from "dayjs";
import { find } from 'lodash'
import { ComboFilter } from "./ProductsFilteringPage";

const getProducts = async ({ pageParam = 1, ...otherParams }) => {
    console.log(pageParam, otherParams)
    const { conds } = otherParams.queryKey[1]
    console.log(conds)
    const from = find(conds, i => i.startsWith('from')) || null
    const to = find(conds, i => i.startsWith('to')) || null
    const description = find(conds, i => i.startsWith('description')) || null
    const { data, status } = await httpClient.post('/products/paging', {
      from: from !== null ? dayjs(from.split('=')[1]).format('YYYY-MM-DDTHH:mm:ss') : null, 
      to: to !== null ? dayjs(to.split('=')[1]).format('YYYY-MM-DDTHH:mm:ss') : null, 
      description: description !== null ? description.split('=')[1] : null, 
      page: pageParam - 1,
      size: 3
    })
    console.log('--status', status, data)
    return data
}

const ProductsInfiniteFilterPage = () => {

    const now = dayjs().format('YYYY-MM-DD')
    const [terms, setTerms] = useState([`from=${now}T00:00:00`]) 

    const {
        isLoading,
        isError,
        error,
        data,
        fetchNextPage,
        isFetching,
        isFetchingNextPage,
        hasNextPage
    } = useInfiniteQuery(['products-infinite-v2', {conds: terms}], getProducts, {
        getNextPageParam: (lastPage, pages) => {
            return (lastPage.pageable.pageNumber == lastPage.totalPages - 1) ? undefined : (lastPage.pageable.pageNumber + 2)
        }
    })

    if (isLoading) {
        return <h2>Loading...</h2>
    }

    if (isError) {
        return <h2>{error.message}</h2>
    }

    const ProductView = ({product}) => {
        return (
            <>
            <span>Id: {product.id}</span> <br />
            <span>Description: {product.description}</span> <br />
            <span>Price: {product.price}</span> <br />
            <span>Re-stock: {product.restock}</span> <br />
            <hr />
            </>
        );
    }

    return ( 
    
        <>
            <h2>Infinite Scroll View</h2>
            <ComboFilter initalQuery={terms} handleQuery={(val) => {setTerms(val)}} />
            <div className="card">
                {data.pages.map(page =>
                    page.content.map(p => <ProductView key={p.id} product={p} />)
                )}
            </div>
            {hasNextPage && (
                <div className='btn-container'>
                    <button onClick={fetchNextPage}>Load More</button>
                </div>
            )}
            
            <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
            {!hasNextPage && !isLoading && (
                <div>
                    Congrats! You have scrolled through all items. You rock! 🤘
                </div>
            )}
        </>
    
    );
}
 
export default ProductsInfiniteFilterPage;