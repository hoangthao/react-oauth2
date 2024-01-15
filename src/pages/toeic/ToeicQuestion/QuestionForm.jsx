import { useListState } from "@mantine/hooks";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { createQuestion, updateQuestion } from "../ToeicAPI";
import dayjs from "dayjs";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { ActionIcon, Group, Stack, Switch, Table, Text, TextInput, Button, rem } from "@mantine/core";
import { IconArrowBack, IconCheck, IconPencil, IconTrash, IconPlus, IconGripVertical } from "@tabler/icons-react";
import classes from '../../toeic/DndTable.module.css';

const QuestionForm = ({initial}) => {

    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [title, setTitle] = useState(initial.title)
    const [note, setNote] = useState(initial.note)
    const [addItem, setAddItem] = useState(false)
    const [state, handlers] = useListState(initial.answers || []);

    const mutation = useMutation(
        (data) => initial.id === undefined ? createQuestion(data) : updateQuestion(data),
        {
            onSuccess: (resp) => {
                queryClient.invalidateQueries(['questions-detail', initial.id])
                navigate(-1)
            }
        }
    )

    const handleSubmit = (e) => {
        e.preventDefault();
        const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
        if (initial.id === undefined) {
            mutation.mutate({
                id: crypto.randomUUID(),
                title,
                note,
                partId: initial.partId,
                answers: state.map(({edit, ...keepAttrs}) => keepAttrs),
                createdAt: now,
                updatedAt: now,
            })
        } else {
            mutation.mutate({
                id: initial.id,
                title,
                note,
                partId: initial.partId,
                answers: state.map(({edit, ...keepAttrs}) => keepAttrs),
                createdAt: initial.createdAt,
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
              <Table.Td>{item.edit === 0 ? item.content : <TextInput autoFocus value={item.content} onChange={(e) => handlers.setItemProp(index, 'content', e.target.value)}/>}</Table.Td>
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
                            <IconCheck />
                        </ActionIcon>
                    </Group>
                ) }
                
              </Table.Td>
            </Table.Tr>
          )}
        </Draggable>
      ));

    return ( <>
    <Stack>
        <Group>
            <Button leftSection={<IconArrowBack size={14} />}  color='lime' onClick={() => navigate(-1)}>Go back</Button>
        </Group>
        <TextInput
            autoFocus
            label="Title"
            mt="md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
        />
         <TextInput
            label="Note"
            mt="md"
            value={note}
            onChange={(e) => setNote(e.target.value)}
        />
        { initial.id !== undefined ? (<>
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
                value={initial.updatedAt}
            />
            <TextInput
                disabled={true}
                label="Part ID"
                mt="md"
                value={initial.partId}
            />
         </>) : null}
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
                        handlers.append({edit: 1, id: new Date().getTime().toString(), correct: false, content: '', note:'-'})
                        setAddItem(true)
                    }}>Add an item</Button></Table.Caption>
                </Table>
            </DragDropContext>
        <div><Button mt="md" onClick={handleSubmit}>Submit</Button></div>
        
    </Stack>
    </> );
}
 
export default QuestionForm;