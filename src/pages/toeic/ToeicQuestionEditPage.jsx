import { ActionIcon, Button, Group, Stack, Switch, Text, TextInput } from "@mantine/core";
import { IconArrowBack, IconBook, IconPencil, IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Table, rem } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { IconGripVertical } from '@tabler/icons-react';
import classes from './DndTable.module.css';
import { createQuestion, updateQuestion } from "./ToeicAPI";
import dayjs from "dayjs";

const timeNumber = () => new Date().getTime()

const now = timeNumber()

const ToeicQuestionEditPage = () => {
    const navigate = useNavigate()
    const { questionId } = useParams()
    const { partId } = useParams()

    const [title, setTitle] = useState('')
    const [note, setNote] = useState('')
    const [addItem, setAddItem] = useState(false)
    const titleRef = useRef(null)
    const queryClient = useQueryClient()
    const [state, handlers] = useListState([]);

    const mutation = useMutation(
        (data) => questionId === undefined ? createQuestion(data) : updateQuestion(data),
        {
            onSuccess: (resp) => {
                console.log(resp)
                queryClient.invalidateQueries(['questions', partId])
                navigate(-1)
            }
        }
    )

    const handleSubmit = (e) => {
        e.preventDefault();
        const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
        if (questionId === undefined) {
            mutation.mutate({
                id: crypto.randomUUID(),
                title,
                note,
                partId,
                answers: state,
                createdAt: now,
                updatedAt: now,
            })
        }
    }

    const items = state.map((item, index) => (
        <Draggable key={item.id} index={index} draggableId={item.id}>
          {(provided) => (
            <Table.Tr className={classes.item} ref={provided.innerRef} {...provided.draggableProps}>
              <Table.Td>
                <div className={classes.dragHandle} {...provided.dragHandleProps}>
                  <IconGripVertical style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                </div>
              </Table.Td>
              <Table.Td style={{ width: rem(80) }}>{item.id}</Table.Td>
              <Table.Td style={{ width: rem(120) }}>{
                item.edit === 0 ? (item.correct ? <Text size="sm" c="red">Yes</Text> : <Text size="sm">No</Text>) : (
                    <Switch
                    onLabel="Yes" offLabel="No" size="lg" 
                    checked={item.correct}
                    onChange={(e) => handlers.setItemProp(index, 'correct', e.currentTarget.checked)}
                    />
                )
              }</Table.Td>
              <Table.Td>{item.edit === 0 ? item.content : <TextInput value={item.content} onChange={(e) => handlers.setItemProp(index, 'content', e.target.value)}/>}</Table.Td>
              <Table.Td>{item.edit === 0 ? item.note : <TextInput value={item.note} onChange={(e) => handlers.setItemProp(index, 'note', e.target.value)}/>}</Table.Td>
              <Table.Td>
                {item.edit === 0 ? (
                    <Group>
                    <ActionIcon onClick={() => handlers.remove(index)} color='lime'>
                        <IconTrash />
                    </ActionIcon>
                    <ActionIcon onClick={() => {
                        handlers.apply((item, idx) => ({ ...item, edit: idx === index ? 1 : 0 }))
                        setAddItem(true)    
                    }}>
                        <IconPencil />
                    </ActionIcon>
                </Group>
                ) : (
                    <Group>
                        <ActionIcon onClick={() => {
                            handlers.setItemProp(index, 'edit', 0)
                            setAddItem(false)
                        }}>
                            <IconX />
                        </ActionIcon>
                    </Group>
                ) }
                
              </Table.Td>
            </Table.Tr>
          )}
        </Draggable>
      ));

    //console.log(questionId)
    //console.log(partId)

    return ( <>
    <Stack>
        <Group>
            <Button leftSection={<IconArrowBack size={14} />}  color='lime' onClick={() => navigate(-1)}>Go back</Button>
        </Group>
        <TextInput
            data-autofocus
            label="Title"
            mt="md"
            value={title}
            ref={titleRef}
            onChange={(e) => setTitle(e.target.value)}
        />
         <TextInput
            label="Note"
            mt="md"
            value={note}
            onChange={(e) => setNote(e.target.value)}
        />
            <DragDropContext
                onDragEnd={({ destination, source }) =>
                handlers.reorder({ from: source.index, to: destination?.index || 0 })
                }
            >
                <Table mt="md">
                <Table.Thead>
                    <Table.Tr>
                    <Table.Th style={{ width: rem(40) }} />
                    <Table.Th style={{ width: rem(40) }}>ID</Table.Th>
                    <Table.Th style={{ width: rem(120) }}>Correct</Table.Th>
                    <Table.Th>Content</Table.Th>
                    <Table.Th>Note</Table.Th>
                    <Table.Th style={{ width: rem(120) }}>&nbsp;</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Droppable droppableId="dnd-list" direction="vertical">
                    {(provided) => (
                    <Table.Tbody {...provided.droppableProps} ref={provided.innerRef}>
                        {items}
                        {provided.placeholder}
                    </Table.Tbody>
                     )}
                </Droppable>
                <Table.Caption><Button 
                    disabled={addItem}
                    leftSection={<IconPlus size={14} />} 
                    onClick={() => {
                        handlers.append({edit: 1, id: timeNumber().toString(), correct: false, content: '', note:''})
                        setAddItem(true)
                    }}>Add an item</Button></Table.Caption>
                </Table>
            </DragDropContext>
        <div><Button mt="md" onClick={handleSubmit}>Submit</Button></div>
        
    </Stack>
    </> );
}
 
export default ToeicQuestionEditPage;