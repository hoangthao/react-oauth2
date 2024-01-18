import { useMutation, useQuery, useQueryClient } from "react-query";
import { createBook, deleteBook, fetchBook, fetchPartByUnitId, fetchQuestionByPartId, fetchUnitByBookId, updateBook } from "../toeic/ToeicAPI";
import { ActionIcon, Anchor, Button, Checkbox, Flex, Grid, Group, List, Paper, ScrollArea, Stack, Table, Text, TextInput, ThemeIcon, UnstyledButton, rem } from "@mantine/core";
import { createContext, useContext, useState } from "react";
import { IconArrowNarrowLeft, IconArrowNarrowRight, IconCheck, IconCircleCheck, IconMinus, IconPencil, IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import { TestContext } from "./TestPage";

const ListQuestion = ({partId}) => {

    //const [index, setIndex] = useState(0)
    const { index, setIndex } = useContext(TestContext);
    const { data: questions, isLoading, error } = useQuery(['questions', partId], () => partId === '' ? [] : fetchQuestionByPartId(partId))

    if (isLoading) return 'Loading...';
    if (error) return `An error occurred ${error.message}`;

    const rows = questions.map((e, idx) => (<ActionIcon variant='outline' onClick={() => setIndex(idx)} key={e.id} disabled={index === idx}>{idx + 1}</ActionIcon>));

    return ( <>
        {questions.length > 0 && (<Stack>
            <Group>{rows}</Group>
            <TestItem q={questions[index]}/>
            {/* <Group>
                <Button onClick={() => setIndex(prev => prev - 1)}
                    leftSection={<IconArrowNarrowLeft size={14} />}
                    disabled={index === 0}>Prev</Button>
                <Text size="sm">{`Show item ${index + 1}/${questions.length}`}</Text>
                <Button onClick={() => setIndex(prev => prev + 1)}
                    rightSection={<IconArrowNarrowRight size={14} />}
                    disabled={index === questions.length-1}>Next</Button>
            </Group> */}
            
        </Stack>
        )}
    </> );
}

const TestItem = ({q}) => {

    const { setQuestionId, setShow } = useContext(TestContext);
    const [check, setCheck] = useState(false)
    const checkHandle = () => {
        setCheck(!check)
    }

    return (<>
        {q && (
            <Paper shadow="xs" p="xl" mt='sm'>
            <Text mb='sm'>{q.title}</Text>
            <List>
                {
                    q.answers.map((a) => (
                        <List.Item key={a.id} style={{listStyleType: 'none'}}>
                            <Group>
                                <Checkbox variant="outline" onChange={(e) => console.log(e.currentTarget.checked, a.id)} label={a.content} />
                                <Text size="sm" c='red' style={{display: check ? 'block' : 'none'}}>{a.correct ? 'correct' : ''}</Text>
                            </Group>
                        </List.Item>
                    ))
                }
            </List>
            <Flex justify="flex-end">
                <ActionIcon mt='sm' onClick={checkHandle} variant='outline' color="lime">
                    {check ? <IconMinus/> : <IconCheck />}
                </ActionIcon> 
                <ActionIcon mt='sm' ml='sm' onClick={() => {setQuestionId(q.id); setShow(true)}}>
                    <IconPencil/>
                </ActionIcon> 
            </Flex>
               
        </Paper>
        )}
    </>)
}

export default ListQuestion