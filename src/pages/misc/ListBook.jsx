import { useMutation, useQuery, useQueryClient } from "react-query";
import { createBook, deleteBook, fetchBook, fetchPartByUnitId, fetchQuestionByPartId, fetchUnitByBookId, updateBook } from "../toeic/ToeicAPI";
import { ActionIcon, Anchor, Button, Checkbox, Flex, Grid, Group, List, Paper, ScrollArea, Stack, Table, Text, TextInput, ThemeIcon, UnstyledButton, rem } from "@mantine/core";
import { createContext, useContext, useState } from "react";
import { IconArrowNarrowLeft, IconArrowNarrowRight, IconCheck, IconCircleCheck, IconMinus, IconPencil, IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import { TestContext } from "./TestPage";

const ListBook = () => {

    const initial = {
        id: '', title: ''
    }
    const { bookId, changeBook } = useContext(TestContext);
    const [ form, setForm ] = useState(initial)
    const [ show, setShow ] = useState(false)
    const queryClient = useQueryClient()
    const { data: books, isLoading, error } = useQuery(['books'], () => fetchBook())

    const mutatePersist = useMutation(
        (data) => form.id === '' ? createBook(data) : updateBook(data),
        {
            onSuccess: (resp) => {
                console.log(resp)
                setForm(initial)
                setShow(false)
                queryClient.invalidateQueries('books')
            }
        }
    )

    const mutateDelete = useMutation(
        (id) => deleteBook(id),
        {
            onSuccess: (resp) => {
                console.log(resp)
                setForm(initial)
                setShow(false)
                queryClient.invalidateQueries('books')
            }
        }
    )

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form)
        const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
        if (form.id === '') {
            mutatePersist.mutate({
                id: crypto.randomUUID(),
                title: form.title,
                createdAt: now,
                updatedAt: now,
            })
        } else {
            mutatePersist.mutate({
                id: form.id,
                title: form.title,
                createdAt: form.createdAt,
                updatedAt: now,
            })
        }
    }

    if (isLoading) return 'Loading...';
    if (error) return `An error occurred ${error.message}`;    

    const rows = books.map((e) => (
        <List.Item style={{listStyleType: 'none'}} key={e.id}>
            <ActionIcon mr="sm" onClick={() => {setForm(e); setShow(true)}}>
                <IconPencil />
            </ActionIcon>
            <UnstyledButton onClick={() => changeBook(e.id)}>{e.id === bookId ? (<b>{e.title}</b>) : (<>{e.title}</>)}</UnstyledButton>
        </List.Item>
    ));

    return (
        <List spacing="xs">
            {rows}
            <List.Item style={{listStyleType: 'none'}}>
                <Group>
                    <ActionIcon onClick={() => mutateDelete.mutate(form.id)} color='gray' display={show && form.id !== ''? 'block':'none'}>
                        <IconTrash />
                    </ActionIcon>
                    <TextInput  display={show? 'block':'none'}
                    value={form.title}
                    onChange={(e) => setForm((val) => { return {...val, title: e.target.value} })}/>
                    <ActionIcon onClick={handleSubmit}  display={show? 'block':'none'}>
                        <IconCheck/>
                    </ActionIcon>
                    <ActionIcon onClick={() => {setShow(false); setForm(initial);}}  display={show? 'block':'none'} color="lime">
                        <IconX/>
                    </ActionIcon>
                    <ActionIcon color="lime" onClick={() => setShow(true)}  display={show? 'none':'block'}>
                        <IconPlus/>
                    </ActionIcon>
                </Group>
            </List.Item>
        </List>)
}

export default ListBook