import { useDisclosure } from '@mantine/hooks';
import { Drawer, Button, TextInput, Stack, Table, Group, ActionIcon } from '@mantine/core';
import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import dayjs from 'dayjs';
import { IconPencil, IconTrash } from '@tabler/icons-react';

const ToeicListPage = () => {

    const [opened, { open, close }] = useDisclosure(false);
    const [ form, setForm ] = useState(null)

    const openForm = (data) => {
        console.log('data', data)
        if (data === undefined) {
            setForm({
                id: '', title: '', createdAt: '', updatedAt: ''
            })
        } else {
            setForm(data)
        }
        open()
    }

    return (<>

        <Drawer opened={opened} onClose={close} title="ETS book">

            <AddForm initial={form}/>

        </Drawer>


        <Stack>
            <div><Button onClick={() => openForm()}>Add Year</Button></div>
            <ListBook openForm={openForm}/>
        </Stack>
    </>);
}

const ListBook = ({openForm}) => {

    const queryClient = useQueryClient()

    const { data: books, isLoading, error } = useQuery(['books'], async () => {
        const response = await fetch('http://localhost:3000/reading')
        return response.json();
    })

    const mutateDelete = useMutation(
        async (id) => {
            const response = await fetch(`http://localhost:3000/reading/${id}`, {
                method: 'DELETE',
            });
            return response.json();
        },
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
            <Table.Td>{element.id}</Table.Td>
            <Table.Td>{element.title}</Table.Td>
            <Table.Td>{element.createdAt}</Table.Td>
            <Table.Td>{element.updatedAt}</Table.Td>
            <Table.Td>
                <Group>
                    <ActionIcon onClick={() => mutateDelete.mutate(element.id)} color='red'>
                        <IconTrash />
                    </ActionIcon>
                    <ActionIcon onClick={() => openForm(element)}>
                        <IconPencil />
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
                    <Table.Th>-</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    )
}

const AddForm = ({initial}) => {

    const [title, setTitle] = useState(initial.title)
    const [updated, setUpdated] = useState(initial.updatedAt)
    const titleRef = useRef(null)
    const queryClient = useQueryClient()

    const mutateReading = useMutation(
        async (data) => {
            if (initial.id === '') {
                const response = await fetch('http://localhost:3000/reading', {
                    method: 'POST',
                    body: JSON.stringify(data),
                });
                return response.json();
            } else {
                const response = await fetch(`http://localhost:3000/reading/${data.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(data),
                });
                return response.json();
            }
        },
        {
            onSuccess: (resp) => {
                console.log(resp)
                resetForm(resp)
                queryClient.invalidateQueries('books')
            }
        }
    )

    const resetForm = (resp) => {
        if (initial.id === '') {
            setTitle('')
        } else {
            setUpdated(resp.updatedAt)
        }
        titleRef.current.focus()
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
        if (initial.id === '') {
            mutateReading.mutate({
                id: crypto.randomUUID(),
                title,
                createdAt: now,
                updatedAt: now,
            })
        } else {
            mutateReading.mutate({
                id: initial.id,
                title,
                createdAt: initial.createdAt,
                updatedAt: now,
            })
        }
        
    }

    return (
        <>
        { initial.id !== '' ? (<TextInput
            disabled={true}
            label="ID"
            value={initial.id}
        />) : null}
        <TextInput
            data-autofocus
            label="Title"
            mt="md"
            value={title}
            ref={titleRef}
            onChange={(e) => setTitle(e.target.value)}
        />
         { initial.id !== '' ? (<>
            <TextInput
                disabled={true}
                label="Created At"
                mt="md"
                value={initial.createdAt}
            />
            <TextInput
                disabled={true}
                label="Updated At"
                mt="md"
                value={updated}
            />
         
         </>) : null}
        <Button mt="md" onClick={handleSubmit}>Submit</Button></>
    )
}

export default ToeicListPage;