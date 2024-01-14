import { Button, TextInput } from '@mantine/core';
import { useRef, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import dayjs from 'dayjs';
import { createBook, updateBook } from '../ToeicAPI';

const BookForm = ({initial}) => {

    const [title, setTitle] = useState(initial.title)
    const [updated, setUpdated] = useState(initial.updatedAt)
    const titleRef = useRef(null)
    const queryClient = useQueryClient()

    const mutateReading = useMutation(
        (data) => initial.id === '' ? createBook(data) : updateBook(data),
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

export default BookForm