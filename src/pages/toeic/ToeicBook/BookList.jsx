import { Table, Group, ActionIcon, rem} from '@mantine/core';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IconNotebook, IconPencil, IconTrash } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { truncate } from 'lodash'
import { deleteBook, fetchBook } from '../ToeicAPI';

const BookList = ({openForm}) => {

    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const { data: books, isLoading, error } = useQuery(['books'], () => fetchBook())

    const mutateDelete = useMutation(
        (id) => deleteBook(id),
        {
            onSuccess: (resp) => {
                console.log(resp)
                queryClient.invalidateQueries('books')
            }
        }
    )

    if (isLoading) return 'Loading...';
    if (error) return `An error occurred ${error.message}`;

    const rows = books.map((element) => (
        <Table.Tr key={element.id}>
            <Table.Td>{truncate(element.id, {length: 10})}</Table.Td>
            <Table.Td><Link to={element.id}>{truncate(element.title, {length: 32})}</Link></Table.Td>
            <Table.Td>{element.createdAt}</Table.Td>
            <Table.Td>{element.updatedAt}</Table.Td>
            <Table.Td>
                <Group>
                    <ActionIcon onClick={() => mutateDelete.mutate(element.id)} color='lime'>
                        <IconTrash />
                    </ActionIcon>
                    <ActionIcon onClick={() => openForm(element)}>
                        <IconPencil />
                    </ActionIcon>
                    <ActionIcon onClick={() => navigate(`practice/${element.id}`)} color='yellow'>
                        <IconNotebook />
                    </ActionIcon>
                </Group>
            </Table.Td>
            <Table.Td>
            <Group gap={0} justify="flex-end">
            <ActionIcon variant="subtle" color="gray">
                <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            </ActionIcon>
            <ActionIcon variant="subtle" color="red">
                <IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            </ActionIcon>
            </Group>
        </Table.Td>
        </Table.Tr>
    ));

    return (
        <Table>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>ID</Table.Th>
                    <Table.Th>Title</Table.Th>
                    <Table.Th>Created at</Table.Th>
                    <Table.Th>Updated at</Table.Th>
                    <Table.Th>&nbsp;</Table.Th>
                    <Table.Th/>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    )
}

export default BookList