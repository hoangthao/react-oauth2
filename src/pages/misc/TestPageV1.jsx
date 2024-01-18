import { useQuery } from "react-query";
import { fetchBook, fetchPartByUnitId, fetchQuestionByPartId, fetchUnitByBookId } from "../toeic/ToeicAPI";
import { Anchor, Button, Grid, List, Table, Text, rem } from "@mantine/core";
import { Link } from "react-router-dom";
import { truncate } from "lodash";
import { useState } from "react";
import { useListState } from "@mantine/hooks";

const UserContext = createContext()

const TestPage = () => {

    const { data: books, isLoading, error } = useQuery(['books'], () => fetchBook())


    if (isLoading) return 'Loading...';
    if (error) return `An error occurred ${error.message}`;

    return ( <>
        {books.length > 0 && <ListBook books={books}/> }
    </> );
}

const ListBook = ({books}) => {

    const [bookId, setBookId] = useState('')
    // const [state, handlers] = useListState(books || []);

    const rows = books.map((e) => (
        <Table.Tr key={e.id}>
            <Table.Td style={{ width: rem(100) }}>{truncate(e.id, {length: 10})}</Table.Td>
            <Table.Td>
            <Anchor component="button" fz="sm" onClick={() => {setBookId(e.id)}}>
                {e.title}
            </Anchor></Table.Td>
        </Table.Tr>
    ));

        
    {/* <Button onClick={() =>  handlers.append({id: new Date().getTime().toString(), title: '???'})} m='sm'>
        Add a book
    </Button> */}

    return (
        <Grid>
        <Grid.Col span={4}>
            <Table>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th style={{ width: rem(100) }}>ID</Table.Th>
                    <Table.Th>Title</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
        </Grid.Col>
        <Grid.Col span={8}><ListUnit bookId={bookId} /></Grid.Col>
      </Grid>
   )
}

const ListUnit = ({bookId}) => {

    const [unitId, setUnitId] = useState('')

    const { data: units, isLoading, error } = useQuery(['units', bookId], () => bookId === ''? [] : fetchUnitByBookId(bookId))

    if (isLoading) return 'Loading...';
    if (error) return `An error occurred ${error.message}`;

    const rows = units.map((e) => (
        <Table.Tr key={e.id}>
            <Table.Td style={{ width: rem(100) }}>{truncate(e.id, {length: 10})}</Table.Td>
            <Table.Td><Anchor component="button" fz="sm" onClick={() => {setUnitId(e.id)}}>{e.title}</Anchor></Table.Td>
        </Table.Tr>
    ));

    return ( <>
        {units.length > 0 && (
        
        <Grid>
            <Grid.Col span={6}>
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th style={{ width: rem(100) }}>ID</Table.Th>
                            <Table.Th>Title</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </Grid.Col>
            <Grid.Col span={6}><ListPart unitId={unitId} /></Grid.Col>
        </Grid>
        )}
    </> );
}

const ListPart = ({unitId}) => {

    const [ partId, setPartId] = useState('')

    const { data: parts, isLoading, error } = useQuery(['parts', unitId], () => unitId === '' ? [] : fetchPartByUnitId(unitId))

    if (isLoading) return 'Loading...';
    if (error) return `An error occurred ${error.message}`;

    const rows = parts.map((e) => (
        <Table.Tr key={e.id}>
            <Table.Td style={{ width: rem(100) }}>{truncate(e.id, {length: 10})}</Table.Td>
            <Table.Td><Anchor component="button" fz="sm" onClick={() => {setPartId(e.id)}}>{e.title}</Anchor></Table.Td>
        </Table.Tr>
    ));

    return ( <>
        {parts.length > 0 && (
             <Grid>
             <Grid.Col span={12}>
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th style={{ width: rem(100) }}>ID</Table.Th>
                            <Table.Th>Title</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table></Grid.Col>
             <Grid.Col span={12}><ListQuestion partId={partId} /></Grid.Col>
           </Grid>
        )}
    </> );
}

const ListQuestion = ({partId}) => {

    const { data: questions, isLoading, error } = useQuery(['questions', partId], () => partId === '' ? [] : fetchQuestionByPartId(partId))

    if (isLoading) return 'Loading...';
    if (error) return `An error occurred ${error.message}`;

    const rows = questions.map((e) => (
        <Table.Tr key={e.id}>
            <Table.Td style={{ width: rem(100) }}>{truncate(e.id, {length: 10})}</Table.Td>
            <Table.Td>{e.title}</Table.Td>
            <Table.Td>
                <List>
                {
                    e.answers.map(e => <List.Item key={e.id} style={styles.listItem}>{e.content}</List.Item>)
                }
                </List>
            </Table.Td>
        </Table.Tr>
    ));

    return ( <>
        {questions.length > 0 && (<>
            <Table>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th style={{ width: rem(100) }}>ID</Table.Th>
                    <Table.Th>Title</Table.Th>
                    <Table.Th>Answers</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
        </>
        )}
    </> );
}


const styles = {
    listItem: {
        listStyleType: 'none'
    }
}

 
export default TestPage;