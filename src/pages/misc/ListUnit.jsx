import { useMutation, useQuery, useQueryClient } from "react-query";
import { createBook, createUnit, deleteBook, deleteUnit, fetchBook, fetchPartByUnitId, fetchQuestionByPartId, fetchUnitByBookId, updateBook, updateUnit } from "../toeic/ToeicAPI";
import { ActionIcon, Anchor, Button, Checkbox, Flex, Grid, Group, List, Paper, ScrollArea, Stack, Table, Text, TextInput, ThemeIcon, UnstyledButton, rem } from "@mantine/core";
import { createContext, useContext, useState } from "react";
import { IconArrowNarrowLeft, IconArrowNarrowRight, IconCheck, IconCircleCheck, IconMinus, IconPencil, IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import { TestContext } from "./TestPage";

const ListUnit = ({bookId}) => {

    const initial = {
        id: '', title: ''
    }

    const { unitId, changeUnit } = useContext(TestContext);
    const [ form, setForm ] = useState(initial)
    const [ show, setShow ] = useState(false)
    const queryClient = useQueryClient()

    const { data: units, isLoading, error } = useQuery(['units', bookId], 
        () => bookId === ''? [] : fetchUnitByBookId(bookId))

    const mutatePersist = useMutation(
        (data) => form.id === '' ? createUnit(data) : updateUnit(data),
        {
            onSuccess: (resp) => {
                console.log(resp)
                setForm(initial)
                setShow(false)
                queryClient.invalidateQueries(['units', bookId])
            }
        }
    )

    const mutateDelete = useMutation(
        (id) => deleteUnit(id),
        {
            onSuccess: (resp) => {
                console.log(resp)
                setForm(initial)
                setShow(false)
                queryClient.invalidateQueries(['units', bookId])
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
                bookId,
                createdAt: now,
                updatedAt: now,
            })
        } else {
            mutatePersist.mutate({
                id: form.id,
                title: form.title,
                bookId,
                createdAt: form.createdAt,
                updatedAt: now,
            })
        }
    }

    if (isLoading) return 'Loading...';
    if (error) return `An error occurred ${error.message}`;

   
    const rows = units.map((e) => (
        <List.Item style={{listStyleType: 'none'}} key={e.id}>
            <ActionIcon mr="sm" onClick={() => {setForm(e); setShow(true)}}>
                <IconPencil />
            </ActionIcon>
            <UnstyledButton onClick={() => changeUnit(e.id)}>{e.id === unitId ? (<b>{e.title}</b>) : (<>{e.title}</>)}</UnstyledButton>
        </List.Item>
    ));

    return ( <>
        
        <List spacing="xs">
            {units.length > 0 && rows}
            {bookId && (
                <List.Item style={{listStyleType: 'none'}}>
                    <Group>
                        <ActionIcon onClick={() => mutateDelete.mutate(form.id)} color='gray' display={show && form.id !== ''? 'block':'none'}>
                            <IconTrash />
                        </ActionIcon>
                        <TextInput  display={show? 'block':'none'}
                        autoFocus
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
            )}
        </List>
       
    </> );
}

export default ListUnit