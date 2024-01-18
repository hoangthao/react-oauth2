import { useParams } from "react-router-dom";
import { fetchPartWithQuestionByUnitId } from "./ToeicAPI";
import { useQuery } from "react-query";
import { memo, useState } from "react";
import { ActionIcon, Checkbox, Group, List, Paper, Stack, Tabs, Text} from "@mantine/core";
import { IconCheck, IconMinus } from "@tabler/icons-react";
import { useListState } from "@mantine/hooks";

import { isEqual } from "lodash";

const ToeicTestPage = ({unitId}) => {

    console.log(unitId)
    const [values, handlers] = useListState([]);

    const { data: parts, isLoading, error } = useQuery(['practice-unit', unitId], () => unitId !== 'empty' ? fetchPartWithQuestionByUnitId(unitId) : [])

    if (isLoading) return 'Loading...';
    if (error) return `An error occurred ${error.message}`;

    console.log(parts)

    const itemDetail = (questions) => (
        questions.map((q) => <TestItem key={q.id} q={q}/>)
    )

    return ( <>
    {parts.length > 0 && (<Tabs defaultValue="0">
      <Tabs.List>
        {
            parts.map((item, idx) => (<Tabs.Tab key={`lbl${item.id}`} value={idx.toString()}>{item.title}</Tabs.Tab>))
        }
      </Tabs.List>
        {
            parts.map((item, idx) => (<Tabs.Panel key={`pnl${item.id}`} value={idx.toString()}>{itemDetail(item.questions)}</Tabs.Panel>))
        }
    </Tabs>)}
    {/* {items} */}
    </> );
}

const TestItem = ({q}) => {
    // const [response, setResponse] = useState()
    // const [value, setValue] = useState([])
    const [check, setCheck] = useState(false)

    const selectHandle = (val, id) => {
        // if (val) {
        //    setValue([...value, {id, val}])
        // } else {
        //    setValue(value.filter(a => a.id !== id))
        // }
        
    }

    const checkHandle = () => {
        // const result = q.answers.filter(e => e.correct === true).map(({id, correct}) => { return {id, val: correct}});
        // setResponse(JSON.stringify(result))
        // console.log(isEqual(result.sort(), value.sort()))
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
                                <Checkbox variant="outline" onChange={(e) => selectHandle(e.currentTarget.checked, a.id)} label={a.content} />
                                <Text size="sm" c='red' style={{display: check ? 'block' : 'none'}}>{a.correct ? 'correct' : ''}</Text>
                            </Group>
                        </List.Item>
                    ))
                }
            </List>
            <ActionIcon mt='sm' onClick={checkHandle}>
                {check ? <IconMinus/> : <IconCheck />}
            </ActionIcon>    
            {/* <Text mb='sm' c='red'>{response}</Text>
            <Text mb='sm' c='blue'>{JSON.stringify(value)}</Text> */}
        </Paper>
    )
}


 
export default ToeicTestPage