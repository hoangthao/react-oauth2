import { useMutation, useQuery, useQueryClient } from "react-query";
import { createBook, createQuestion, deleteBook, fetchBook, fetchPartByUnitId, fetchQuestionById, fetchQuestionByPartId, fetchUnitByBookId, updateBook, updateQuestion } from "../toeic/ToeicAPI";
import { ActionIcon, Anchor, Button, Checkbox, Flex, Grid, Group, List, Paper, ScrollArea, Stack, Switch, Table, Text, TextInput, Textarea, ThemeIcon, UnstyledButton, rem } from "@mantine/core";
import { createContext, useContext, useState } from "react";
import { IconArrowNarrowLeft, IconArrowNarrowRight, IconCheck, IconCircleCheck, IconGripVertical, IconMinus, IconPencil, IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import ListBook from "./ListBook";
import ListPart from "./ListPart";
import ListQuestion from "./ListQuestion";
import ListUnit from "./ListUnit";
import QuestionForm from "../toeic/ToeicQuestion/QuestionForm";
import { useListState } from "@mantine/hooks";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import classes from '../toeic/DndTable.module.css';

export const TestContext = createContext()

const TestPage = () => {

    const [ bookId, setBookId] = useState('')
    const [ unitId, setUnitId] = useState('')
    const [ partId, setPartId] = useState('')
    const [ questionId, setQuestionId] = useState('')
    const [ show, setShow ] = useState(false)
    const [ index, setIndex ] = useState(0)

    const changePart = (id) => {
        setPartId(id)
        setQuestionId('')
        setShow(false)
        setIndex(0)
    }

    const changeUnit = (id) => {
        setUnitId(id)
        changePart('')
    }

    const changeBook = (id) => {
        setBookId(id)
        changeUnit('')
    }

    return ( 
        <TestContext.Provider value={{bookId, changeBook, 
                                    unitId, changeUnit, 
                                    partId, changePart,
                                    setShow, setQuestionId,
                                    index, setIndex}}>
            <Grid>
                <Grid.Col span={4}><ScrollArea h={250}><ListBook/></ScrollArea></Grid.Col>
                <Grid.Col span={4}><ScrollArea h={250}><ListUnit bookId={bookId}/></ScrollArea></Grid.Col>
                <Grid.Col span={4}><ScrollArea h={250}><ListPart unitId={unitId}/></ScrollArea></Grid.Col>
                <Grid.Col span={12} display={show? 'none':'block'}>
                    <ListQuestion partId={partId}/>
                </Grid.Col>
                <Grid.Col span={12}>
                    { partId !== ''  && (
                        <ActionIcon color="lime" onClick={() => setShow((prev) => !prev)} mt='sm'>
                            {show ? <IconMinus/> : <IconPlus/>}
                        </ActionIcon>
                    )}
                </Grid.Col>
                <Grid.Col span={12} display={show? 'block':'none'}>
                    <EditQuestion questionId={questionId} />
                </Grid.Col>
            </Grid>
      </TestContext.Provider>);
}

const EditQuestion = ({ questionId } ) => {

    const { partId } = useContext(TestContext);
    let initial = {
        title: '', note: '-', answers: [], partId
    }

    const { data, isLoading, error } = useQuery(['questions-detail', questionId], 
    () => questionId === '' ? null : fetchQuestionById(questionId))

    if (isLoading) return 'Loading...';
    if (error) return `An error occurred ${error.message}`;

    if (data != null) {
        initial = data;
        if (initial.answers) {
            initial.answers = initial.answers?.map((item) => ({...item, edit: 0}))
        }
    }
     return ( <>
       <FormQuestion initial={initial} />
    </> );
}

const FormQuestion = ({initial}) => {

    const { setShow, setQuestionId } = useContext(TestContext);
    const queryClient = useQueryClient()
    const [title, setTitle] = useState(initial.title)
    const [note, setNote] = useState(initial.note)
    const [addItem, setAddItem] = useState(false)
    const [state, handlers] = useListState(initial.answers || []);

    const mutation = useMutation(
        (data) => initial.id === undefined ? createQuestion(data) : updateQuestion(data),
        {
            onSuccess: (resp) => {
                setQuestionId('')
                setTitle('')
                setNote('-')
                handlers.setState([])
                setAddItem(false);
                setShow(false)
                queryClient.invalidateQueries(['questions', initial.partId])
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
              
              <Table.Td>{item.edit === 0 ? item.content : 
                <TextInput autoFocus value={item.content} onChange={(e) => handlers.setItemProp(index, 'content', e.target.value)}/>
               }</Table.Td>
              <Table.Td>{item.edit === 0 ? item.note : <TextInput value={item.note} onChange={(e) => handlers.setItemProp(index, 'note', e.target.value)}/>}</Table.Td>
              <Table.Td style={{ width: rem(120) }}>{
                item.edit === 0 ? (item.correct ? <Text size="sm" c="red">Yes</Text> : <Text size="sm">No</Text>) : (
                    <Switch
                    onLabel="Yes" offLabel="No" size="lg" 
                    checked={item.correct}
                    onChange={(e) => handlers.setItemProp(index, 'correct', e.currentTarget.checked)}
                    />
                )
              }</Table.Td>
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
        <Grid>
            <Grid.Col span={5}>
                <Stack>
                {/* <TextInput
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
                /> */}
                <Textarea
                    autoFocus
                    label="Title"
                    mt="md"
                    autosize
                    minRows={2}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <Textarea
                    label="Note"
                    autosize
                    minRows={2}
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
                <div><Button mt="md" onClick={handleSubmit}>Submit</Button></div>
                </Stack>
            </Grid.Col>
            <Grid.Col span={7}>
                <DragDropContext
                    onDragEnd={({ destination, source }) => handlers.reorder({ from: source.index, to: destination?.index || 0 })}>
                    <Table mt="md">
                    <Table.Thead>
                        <Table.Tr>
                        <Table.Th style={{ width: rem(40) }} />
                        <Table.Th style={{ width: rem(40) }}>ID</Table.Th>
                        <Table.Th>Content</Table.Th>
                        <Table.Th>Note</Table.Th>
                        <Table.Th style={{ width: rem(120) }}>Correct</Table.Th>
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
            </Grid.Col>
        </Grid>
    </> );
}
 
 
export default TestPage;