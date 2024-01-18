import { useQuery } from "react-query";
import { fetchBook, fetchPartByUnitId, fetchQuestionByPartId, fetchUnitByBookId } from "../toeic/ToeicAPI";
import { ActionIcon, Anchor, Button, Checkbox, Divider, Flex, Grid, Group, List, Paper, Stack, Table, Text, ThemeIcon, UnstyledButton, rem } from "@mantine/core";
import { Link } from "react-router-dom";
import { truncate } from "lodash";
import { createContext, useContext, useState } from "react";
import { useListState } from "@mantine/hooks";
import { IconArrowNarrowLeft, IconArrowNarrowRight, IconCheck, IconCircleCheck, IconMinus } from "@tabler/icons-react";

const TestContext = createContext()

const TestPage = () => {

    const [ bookId, setBookId] = useState('')
    const [ unitId, setUnitId] = useState('')
    const [ partId, setPartId] = useState('')

    return ( 
        <TestContext.Provider value={{setBookId, setUnitId, setPartId}}>
    <Grid>
        <Grid.Col span={4}><ListBook/></Grid.Col>
        <Grid.Col span={4}><ListUnit bookId={bookId}/></Grid.Col>
        <Grid.Col span={4}><ListPart unitId={unitId}/></Grid.Col>
        <Grid.Col span={12}>
            <ListQuestion partId={partId}/>
        </Grid.Col>
      </Grid>
      </TestContext.Provider>
      );
}

const ListBook = () => {

    const { setBookId } = useContext(TestContext);
    const { data: books, isLoading, error } = useQuery(['books'], () => fetchBook())

    if (isLoading) return 'Loading...';
    if (error) return `An error occurred ${error.message}`;    

    const rows = books.map((e) => (
        <List.Item style={{listStyleType: 'none'}} key={e.id}><UnstyledButton onClick={() => setBookId(e.id)}>{e.title}</UnstyledButton></List.Item>
    ));

    return (
        <List
      mt='md'
      spacing="xs"
      size="sm"
      center
      icon={
        <ThemeIcon color="teal" size={24} radius="xl">
          <IconCircleCheck style={{ width: rem(16), height: rem(16) }} />
        </ThemeIcon>
      }
    >{rows}</List>
   )
}

const ListUnit = ({bookId}) => {

    const { setUnitId } = useContext(TestContext);

    const { data: units, isLoading, error } = useQuery(['units', bookId], () => bookId === ''? [] : fetchUnitByBookId(bookId))

    if (isLoading) return 'Loading...';
    if (error) return `An error occurred ${error.message}`;

   
    const rows = units.map((e) => (
        <List.Item style={{listStyleType: 'none'}} key={e.id}><UnstyledButton onClick={() => setUnitId(e.id)}>{e.title}</UnstyledButton></List.Item>
    ));

    return ( <>
        {units.length > 0 && (
        <List
        mt='md'
        spacing="xs"
        size="sm"
        center
        icon={
          <ThemeIcon color="teal" size={24} radius="xl">
            <IconCircleCheck style={{ width: rem(16), height: rem(16) }} />
          </ThemeIcon>
        }
      >{rows}</List>
        )}
    </> );
}

const ListPart = ({unitId}) => {

    const { setPartId } = useContext(TestContext);

    const { data: parts, isLoading, error } = useQuery(['parts', unitId], () => unitId === '' ? [] : fetchPartByUnitId(unitId))

    if (isLoading) return 'Loading...';
    if (error) return `An error occurred ${error.message}`;

    const rows = parts.map((e) => (
        <List.Item style={{listStyleType: 'none'}} key={e.id}><UnstyledButton onClick={() => setPartId(e.id)}>{e.title}</UnstyledButton></List.Item>
    ));

    return ( <>
        {parts.length > 0 && (<List
      mt='md'
      spacing="xs"
      size="sm"
      center
      icon={
        <ThemeIcon color="teal" size={24} radius="xl">
          <IconCircleCheck style={{ width: rem(16), height: rem(16) }} />
        </ThemeIcon>
      }
    >{rows}</List>)}
    </> );
}

const ListQuestion = ({partId}) => {

    const [index, setIndex] = useState(0)
    const { data: questions, isLoading, error } = useQuery(['questions', partId], () => partId === '' ? [] : fetchQuestionByPartId(partId))

    if (isLoading) return 'Loading...';
    if (error) return `An error occurred ${error.message}`;

    //const rows = questions.map((e) => (<TestItem key={e.id} q={e}/>));

    return ( <>
        {questions.length > 0 && (<Stack>
            <TestItem q={questions[index]}/>
            <Group>
                <Button onClick={() => setIndex(prev => prev - 1)}
                    leftSection={<IconArrowNarrowLeft size={14} />}
                    disabled={index === 0}>Prev</Button>
                <Text size="sm">{`Show item ${index + 1}/${questions.length}`}</Text>
                <Button onClick={() => setIndex(prev => prev + 1)}
                    rightSection={<IconArrowNarrowRight size={14} />}
                    disabled={index === questions.length-1}>Next</Button>
            </Group>
            
        </Stack>
        )}
    </> );
}

const TestItem = ({q}) => {

    const [check, setCheck] = useState(false)
    const checkHandle = () => {
        setCheck(!check)
    }

    return (
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
                <ActionIcon mt='sm' onClick={checkHandle}>
                    {check ? <IconMinus/> : <IconCheck />}
                </ActionIcon> 
            </Flex>
               
        </Paper>
    )
}


const styles = {
    listItem: {
        listStyleType: 'none'
    }
}

 
export default TestPage;