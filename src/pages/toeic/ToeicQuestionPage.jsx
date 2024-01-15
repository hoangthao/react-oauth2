import { ActionIcon, Button, Divider, Grid, Group, Paper, Stack, Text } from "@mantine/core";
import { IconArrowBack, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { deleteQuestion, fetchQuestionByPartId } from "./ToeicAPI";

const ToeicQuestionPage = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const { partId } = useParams()

    // console.log(partId)

    const { data: questions, isLoading, error } = useQuery(['questions', partId], () => fetchQuestionByPartId(partId))

    const mutateDelete = useMutation(
        (id) => deleteQuestion(id),
        {
            onSuccess: (resp) => {
                console.log(resp)
                queryClient.invalidateQueries(['questions', partId])
            }
        }
    )

    if (isLoading) return 'Loading...';
    if (error) return `An error occurred ${error.message}`;

    const items = questions.map((element) => (
        <Grid.Col span={4} key={element.id}>
            <Paper shadow="xs" p="xl">
            <Text>{element.title}</Text>
            <Divider my="md" />
            {
                element.answers.map((a) => (
                    <Text key={a.id}>{a.content}</Text>
                ))
            }
            <Divider my="md" />
            <Group mt="md">
                    <ActionIcon onClick={() => mutateDelete.mutate(element.id)} color='lime'>
                        <IconTrash />
                    </ActionIcon>
                    <ActionIcon onClick={() => console.log('edit')}>
                        <IconPencil />
                    </ActionIcon>
            </Group>
            </Paper>
        </Grid.Col>
    ));

    return ( <>
    <Stack>
        <Group>
            <Button leftSection={<IconArrowBack size={14} />}  color='lime' onClick={() => navigate(-1)}>Go back</Button>
            <Button leftSection={<IconPlus size={14} />} onClick={() => navigate('new')}>Add a question</Button>
        </Group>
        <Grid>
            {items}
        </Grid>
    </Stack>
    </> );
}
 
export default ToeicQuestionPage;