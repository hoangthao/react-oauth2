import { Table } from '@mantine/core'

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
    <Table stickyHeader stickyHeaderOffset={60}>
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
 
export default ProductList;