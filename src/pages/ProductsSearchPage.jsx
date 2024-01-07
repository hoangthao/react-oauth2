import { useState } from "react"
import httpClient from "../api/HttpClient"
import { useQuery } from "react-query"
import { Table, Pagination, TextInput, Stack, Button } from '@mantine/core'

const getProducts = async (page, term) => {
    const { data, status } = await httpClient.post('/products/paging', {
        from: null,
        to: null, 
        description: ((term && term !== '') ? term : null),
        page: page - 1,
        size: 5
    })
    console.log('--status', status, data)
    return data
}

const ProductList = ({products}) => {
  const rows = products.map((element) => (
      <Table.Tr key={element.id}>
        <Table.Td>{element.id}</Table.Td>
        <Table.Td>{element.description}</Table.Td>
        <Table.Td>{element.price}</Table.Td>
        <Table.Td>{element.restock}</Table.Td>
      </Table.Tr>
    ));

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Id</Table.Th>
          <Table.Th>Description</Table.Th>
          <Table.Th>Price</Table.Th>
          <Table.Th>Re-stock date</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
      </Table>
  )
}

const Filter = ({initalQuery, handleQuery}) => {
  const [query, setQuery] = useState(initalQuery)
  return (
    <>
    <TextInput
          label="Searching"
          placeholder="Enter keyword"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
        <Button onClick={()=> handleQuery(query)}>Submit</Button>
    </>
  )
}

const ProductsSearchPage = () => {

    const [page, setPage] = useState(1)
    const [term, setTerms] = useState('')
   
    const { data, error, isLoading, isError } = useQuery({
        queryKey: ['products', page, term],
        queryFn: () => getProducts(page, term)
    })

    if (isLoading) {
        return <h2>Loading...</h2>
    }

    if (isError) {
        return <h2>{error.message}</h2>
    }

    return ( 
    
        <Stack>
            <Filter initalQuery={term} handleQuery={(val) => {setTerms(val); setPage(1)}} />
            {data && data.content.length === 0 ? 'No results' : (<>
              <ProductList products={data.content}/>
              <Pagination total={data.totalPages} onChange={setPage} value={page}/>
            </>)}
             
        </Stack>
    
    );
}
 
export default ProductsSearchPage;