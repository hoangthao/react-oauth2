import { useRef, useState } from "react"
import { useMutation, useQueryClient } from "react-query"
import { Button, TextInput } from "@mantine/core";
import dayjs from "dayjs";
import { createPart, updatePart } from "../ToeicAPI";

const PartForm = ({initial}) => {
    const [title, setTitle] = useState(initial.title)
    const [updated, setUpdated] = useState(initial.updatedAt)
    const titleRef = useRef(null)
    const queryClient = useQueryClient()

    const mutation = useMutation(
        (data) => initial.id === '' ? createPart(data) : updatePart(data),
        {
            onSuccess: (resp) => {
                console.log(resp)
                resetForm(resp)
                queryClient.invalidateQueries(['parts', initial.unitId])
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
            mutation.mutate({
                id: crypto.randomUUID(),
                title,
                unitId: initial.unitId,
                createdAt: now,
                updatedAt: now,
            })
        } else {
            mutation.mutate({
                id: initial.id,
                title,
                unitId: initial.unitId,
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
            <TextInput
                disabled={true}
                label="Unit ID"
                mt="md"
                value={initial.unitId}
            />
         </>) : null}
        <Button mt="md" onClick={handleSubmit}>Submit</Button></>
    )
}
 
export default PartForm;