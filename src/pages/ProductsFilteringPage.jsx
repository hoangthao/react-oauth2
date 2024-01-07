import { useState } from "react"
import httpClient from "../api/HttpClient"
import { useQuery } from "react-query"
import { Table, Pagination, TextInput, Stack, Button, Combobox, Pill, PillsInput, 
  useCombobox } from '@mantine/core'
import dayjs from "dayjs";
import { find } from 'lodash'

const getProducts = async (page, terms) => {
    const from = find(terms, i => i.startsWith('from')) || null
    const to = find(terms, i => i.startsWith('to')) || null
    const description = find(terms, i => i.startsWith('description')) || null
    const { data, status } = await httpClient.post('/products/paging', {
      from: from !== null ? dayjs(from.split('=')[1]).format('YYYY-MM-DDTHH:mm:ss') : null, 
      to: to !== null ? dayjs(to.split('=')[1]).format('YYYY-MM-DDTHH:mm:ss') : null, 
      description: description !== null ? description.split('=')[1] : null, 
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

const ComboFilter = ({initalQuery, handleQuery}) => {
  const [search, setSearch] = useState('');
  const [selections, setSelections] = useState(initalQuery);
  const [error, setError] = useState({})

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    // onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  });
  const handleValueSelect = (val) => {
    setSelections((current) => current.includes(val) ? current.filter((v) => v !== val) : [...current, val]);
    setSearch('')
    combobox.closeDropdown()
  }
  const handleValueRemove = (val) => setSelections((current) => current.filter((v) => v !== val));

  const values = selections.map((item) => (
    <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
      <span><b>{`${item.split('=')[0]}=`}</b>{item.split('=')[1]}</span>
    </Pill>
  ));

  const options = ['from', 'to', 'description']
    .filter((item) => !selections.some((i) => i.startsWith(item)))
    .map((item) => (
      <Combobox.Option value={`${item}=${search}`} key={item}>
        {`${item}=${search}`}
      </Combobox.Option>
    ));

  const handleFilter = () => {
    const from = find(selections, i => i.startsWith('from')) || null
    const to = find(selections, i => i.startsWith('to')) || null

    let err = ''

    if (from && !dayjs(from.split('=')[1]).isValid()) {
      err += `${from} is invalid. `
    }
    to
    if (to && !dayjs(to.split('=')[1]).isValid()) {
      err += `${to} is invalid. `
    }

    if (err !== '') {
      setError({
        error: err
      })
    } else {
      setError({})
      if (find(selections, i => i.startsWith('from')) === undefined) {
        const now = dayjs().format('YYYY-MM-DD')
        setSelections((current) => [...current, `from=${now}T00:00:00`], () => {
          handleQuery(selections)
        })
      } else {
        handleQuery(selections)
      }
    }
  }
  
  return ( <>
    <Combobox store={combobox} onOptionSubmit={handleValueSelect} withinPortal={false} {...error}>
      <Combobox.DropdownTarget>
        <PillsInput onClick={() => combobox.openDropdown()}>
          <Pill.Group>
            {values}

            <Combobox.EventsTarget>
              <PillsInput.Field
                onFocus={() => combobox.openDropdown()}
                onBlur={() => combobox.closeDropdown()}
                value={search}
                placeholder="Enter values"
                onChange={(event) => {
                  combobox.updateSelectedOptionIndex();
                  setSearch(event.currentTarget.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Backspace' && search.length === 0) {
                    event.preventDefault();
                    handleValueRemove(selections[selections.length - 1]);
                  }
                }}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options.length > 0 ? options : <Combobox.Empty>Nothing found...</Combobox.Empty>}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
    <Button onClick={handleFilter}>Submit</Button>
    </>
  );
}

const ProductsFilteringPage = () => {
    const now = dayjs().format('YYYY-MM-DD')
    const [page, setPage] = useState(1)
    const [terms, setTerms] = useState([`from=${now}T00:00:00`])
   
    const { data, error, isLoading, isError } = useQuery({
        queryKey: ['products', page, terms],
        queryFn: () => getProducts(page, terms)
    })

    if (isLoading) {
        return <h2>Loading...</h2>
    }

    if (isError) {
        return <h2>{error.message}</h2>
    }

    return ( 
    
        <Stack>
            <ComboFilter initalQuery={terms} handleQuery={(val) => {setTerms(val); setPage(1)}} />
            {data && data.content.length === 0 ? 'No results' : (<>
              <ProductList products={data.content}/>
              <Pagination total={data.totalPages} onChange={setPage} value={page}/>
            </>)}
             
        </Stack>
    
    );
}
 
export default ProductsFilteringPage;