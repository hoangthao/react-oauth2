import { useState } from "react"
import httpClient from "../../api/HttpClient"
import { useInfiniteQuery } from "react-query"

const getProducts = async ({ pageParam = 1 }) => {
    const { data, status } = await httpClient.post('/products/paging', {
        from: '2024-01-01T00:00:00',
        to: null, 
        description: null, 
        page: pageParam - 1,
        size: 5
    })
    console.log('--status', status, data)
    return data
}
/*
export const useGetProducts = (filters: GetProductsQueryParamsType) =>
  useInfiniteQuery({
    queryKey: productKeys.listStoreProducts(filters),
    queryFn: async ({ pageParam = 1 }) => getProducts({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const newPage = lastPage.page + 1
      const numPages = Math.ceil(lastPage.total / lastPage.take)
      if (newPage <= numPages) {
        return newPage
      } else {
        return lastPage.page
      }
    }
  });
  export async function getProducts({page, ...otherParams}) {
  return axiosInstance
    .get(`/products`, { params: {page, ...otherParams} })
    .then(...)
    .catch(...);
}
*/

const ProductsInfinitePage = () => {

    const {
        isLoading,
        isError,
        error,
        data,
        fetchNextPage,
        isFetching,
        isFetchingNextPage
    } = useInfiniteQuery(['products-infinite'], getProducts, {
        getNextPageParam: (lastPage, pages) => {
            // console.log('lastPage', lastPage)
            // console.log('pages', pages)
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
            <div className="card">
                {data.pages.map(page =>
                    page.content.map(p => <ProductView key={p.id} product={p} />)
                )}
            </div>
            <div className='btn-container'>
                <button onClick={fetchNextPage}>Load More</button>
            </div>
            <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
        </>
    
    );
}
 
export default ProductsInfinitePage;