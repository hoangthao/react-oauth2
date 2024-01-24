import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { ActionIcon, Button, Grid, Group, List, 
  Paper, ScrollArea, Stack, Table, Text, 
  TextInput, Textarea, UnstyledButton, rem,
  TypographyStylesProvider, 
  Flex} from '@mantine/core';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { createContext, useContext, useState } from 'react';
import { IconCheck, IconMinus, IconPencil, IconPlus, IconTrash, IconX } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { createAnswer, createCategory, createQuestion, deleteCategory, deleteQuestion, fetchAnswerByQuestionyId, fetchCategory, 
  fetchQuestionByCategoryId, updateAnswer, updateCategory, updateQuestion } from './InterviewAPI';

export const InterviewContext = createContext()

const EssentialPage = () => {

    const [ categoryId, setCategoryId] = useState('')
    const [ questionId, setQuestionId] = useState('')
    const [ show, setShow ] = useState(false)
    const [ index, setIndex ] = useState(0)
    const [ answer, setAnswer ] = useState()

    const changeCategory = (id) => {
      setCategoryId(id)
      changeQuestion('')
    }

    const changeQuestion = (id) => {
      setQuestionId(id)
      setShow(false)
      setIndex(0)
      setAnswer(undefined)
    }

    return (
      <InterviewContext.Provider value={{categoryId, changeCategory,
        questionId, changeQuestion, 
        setShow,
        index, setIndex,
        answer, setAnswer}}>
        <Grid>
          <Grid.Col span={4}><ScrollArea h={250}><ListCategory/></ScrollArea></Grid.Col>
          <Grid.Col span={8}><ScrollArea h={250}><ListQuestion categoryId={categoryId}/></ScrollArea></Grid.Col>
          <Grid.Col span={12} display={show? 'none':'block'}>
              <ListAnswer questionId={questionId}/>
          </Grid.Col>
          <Grid.Col span={12}>
              { questionId !== ''  && (
                  <ActionIcon color="lime" onClick={() => setShow((prev) => !prev)} mt='sm'>
                      {show ? <IconMinus/> : <IconPlus/>}
                  </ActionIcon>
              )}
          </Grid.Col>
          <Grid.Col span={12} display={show? 'block':'none'}>
              <EditAnswer/>
          </Grid.Col>
        </Grid>
      </InterviewContext.Provider>
    );
}

const ListAnswer = ({questionId}) => {

  const { index, setIndex } = useContext(InterviewContext);
  const { data: answers, isLoading, error } = useQuery(['answers', questionId], () => questionId === '' ? [] : fetchAnswerByQuestionyId(questionId))

  if (isLoading) return 'Loading...';
  if (error) return `An error occurred ${error.message}`;

  const rows = answers.map((e, idx) => 
    (<ActionIcon variant='outline' onClick={() => setIndex(idx)} key={e.id} disabled={index === idx}>{idx + 1}</ActionIcon>));

  return (<>
  {
    answers.length > 0 && (<Stack>
      <Group>{rows}</Group>
      <Item answer={answers[index]} />
    </Stack>)
  }
  
  </>)
}

const Item = ({answer}) => {

  const { setShow, setAnswer } = useContext(InterviewContext)

  return (
    <>
    <Paper shadow="xs" withBorder>
    <TypographyStylesProvider pt='lg'>
      <div
        dangerouslySetInnerHTML={{ __html: answer.content }}
      />
    </TypographyStylesProvider>
    <ActionIcon mt='sm' ml='sm' onClick={() => {setAnswer(answer); setShow(true)}}>
            <IconPencil/>
        </ActionIcon> 
    </Paper>
    </>
  )
}

const EditAnswer = () => {
  const { questionId, answer } = useContext(InterviewContext);
  console.log('ans', answer)
  console.log('cnt', answer?.content )
  const queryClient = useQueryClient()
  const { setShow } = useContext(InterviewContext);
  const [ content, setContent ] = useState(answer?.content || '')
  const mutation = useMutation(
    (data) => answer === undefined ? createAnswer(data) : updateAnswer(data),
    {
        onSuccess: (resp) => {
          setContent('')
          setShow(false)
          queryClient.invalidateQueries(['answers', questionId])
        }
    })

    const handleSubmit = (e) => {
      e.preventDefault();
      const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
      if (answer === undefined) {
          mutation.mutate({
            id: crypto.randomUUID(),
            content,
            questionId,
            createdAt: now,
            updatedAt: now,
        })
      } else {
          mutation.mutate({...answer,
            content,
            updatedAt: now,
        })
      }
      
  }
  return (<Stack>
    <Editor content={content} setValue={setContent} />
    <Group><Button onClick={handleSubmit}>Save</Button></Group>
  </Stack>)
}

const ListQuestion = ({categoryId}) => {

  const initial = {
      id: '', title: ''
  }
  const { questionId, changeQuestion } = useContext(InterviewContext);
  const [ form, setForm ] = useState(initial)
  const [ show, setShow ] = useState(false)
  const queryClient = useQueryClient()
  const { data: questions, isLoading, error } = useQuery(['questions', categoryId], 
  () => categoryId === '' ? [] : fetchQuestionByCategoryId(categoryId))

  const mutatePersist = useMutation(
      (data) => form.id === '' ? createQuestion(data) : updateQuestion(data),
      {
          onSuccess: (resp) => {
              console.log(resp)
              setForm(initial)
              setShow(false)
              queryClient.invalidateQueries('questions', categoryId)
          }
      }
  )

  const mutateDelete = useMutation(
      (id) => deleteQuestion(id),
      {
          onSuccess: (resp) => {
              console.log(resp)
              setForm(initial)
              setShow(false)
              queryClient.invalidateQueries('questions', categoryId)
          }
      }
  )

  const handleSubmit = (e) => {
      e.preventDefault();
      console.log(form)
      const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
      if (form.id === '') {
          mutatePersist.mutate({
              id: crypto.randomUUID(),
              title: form.title,
              categoryId,
              createdAt: now,
              updatedAt: now,
          })
      } else {
          mutatePersist.mutate({
              id: form.id,
              title: form.title,
              categoryId,
              createdAt: form.createdAt,
              updatedAt: now,
          })
      }
  }

  if (isLoading) return 'Loading...';
  if (error) return `An error occurred ${error.message}`;    

  const rows = questions.map((e) => (
      <Table.Tr key={e.id}>
        <Table.Td>
          <ActionIcon variant="subtle" color="gray" onClick={() => {setForm(e); setShow(true)}}>
                <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            </ActionIcon>
          <UnstyledButton onClick={() => changeQuestion(e.id)}>{e.id === questionId ? (<b>{e.title}</b>) : (<>{e.title}</>)}</UnstyledButton>
        </Table.Td>
        <Table.Td />
      </Table.Tr>
  ));

  return (<>    
    <Table withRowBorders={false}> 
      <Table.Tbody>
          {questions.length > 0 && rows}
          {categoryId && 
              <Table.Tr>
                <Table.Td>
                 
                  <Textarea  display={show? 'block':'none'}
                  autosize
                  minRows={2}
                  value={form.title}
                  onChange={(e) => setForm((val) => { return {...val, title: e.target.value} })}/>
                </Table.Td>
                  <Table.Td>
                    <ActionIcon variant="subtle" onClick={handleSubmit}  display={show? 'block':'none'}>
                        <IconCheck />
                    </ActionIcon>
                    <ActionIcon variant="subtle" onClick={() => {setShow(false); setForm(initial);}}  display={show? 'block':'none'} color="lime">
                        <IconX />
                    </ActionIcon>
                    <ActionIcon variant="subtle" onClick={() => mutateDelete.mutate(form.id)} color='gray' display={show && form.id !== ''? 'block':'none'}>
                      <IconTrash />
                  </ActionIcon>
                  </Table.Td>
                  <Table.Td />
              </Table.Tr>
          }
      </Table.Tbody>
    </Table>
    {categoryId && 
      <ActionIcon variant="subtle" color="lime" onClick={() => setShow(true)}  display={show? 'none':'block'}>
          <IconPlus />
      </ActionIcon>
}
    </>
  )
}

const ListCategory = () => {

  const initial = {
      id: '', title: ''
  }
  const { categoryId, changeCategory } = useContext(InterviewContext);
  const [ form, setForm ] = useState(initial)
  const [ show, setShow ] = useState(false)
  const queryClient = useQueryClient()
  const { data: categories, isLoading, error } = useQuery(['categories'], () => fetchCategory())

  const mutatePersist = useMutation(
      (data) => form.id === '' ? createCategory(data) : updateCategory(data),
      {
          onSuccess: (resp) => {
              console.log(resp)
              setForm(initial)
              setShow(false)
              queryClient.invalidateQueries('categories')
          }
      }
  )

  const mutateDelete = useMutation(
      (id) => deleteCategory(id),
      {
          onSuccess: (resp) => {
              console.log(resp)
              setForm(initial)
              setShow(false)
              queryClient.invalidateQueries('categories')
          }
      }
  )

  const handleSubmit = (e) => {
      e.preventDefault();
      console.log(form)
      const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
      if (form.id === '') {
          mutatePersist.mutate({
              id: crypto.randomUUID(),
              title: form.title,
              createdAt: now,
              updatedAt: now,
          })
      } else {
          mutatePersist.mutate({
              id: form.id,
              title: form.title,
              createdAt: form.createdAt,
              updatedAt: now,
          })
      }
  }

  if (isLoading) return 'Loading...';
  if (error) return `An error occurred ${error.message}`;    

  const rows = categories.map((e) => (
      <List.Item style={{listStyleType: 'none'}} key={e.id}>
          <ActionIcon variant="subtle" color="gray" onClick={() => {setForm(e); setShow(true)}}>
                <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            </ActionIcon>
          <UnstyledButton onClick={() => changeCategory(e.id)}>{e.id === categoryId ? (<b>{e.title}</b>) : (<>{e.title}</>)}</UnstyledButton>
      </List.Item>
  ));

  return (
      <List spacing='xs'>
          {rows}
          <List.Item style={{listStyleType: 'none'}}>
              <Group>
                  <ActionIcon variant="subtle" onClick={() => mutateDelete.mutate(form.id)} color='gray' display={show && form.id !== ''? 'block':'none'}>
                      <IconTrash />
                  </ActionIcon>
                  <TextInput  display={show? 'block':'none'}
                  value={form.title}
                  onChange={(e) => setForm((val) => { return {...val, title: e.target.value} })}/>
                  <ActionIcon variant="subtle" onClick={handleSubmit}  display={show? 'block':'none'}>
                      <IconCheck />
                  </ActionIcon>
                  <ActionIcon variant="subtle" onClick={() => {setShow(false); setForm(initial);}}  display={show? 'block':'none'} color="lime">
                      <IconX />
                  </ActionIcon>
                  <ActionIcon variant="subtle" color="lime" onClick={() => setShow(true)}  display={show? 'none':'block'}>
                      {/* <IconPlus />Add a new Category */}
                      <IconPlus />
                  </ActionIcon>
              </Group>
          </List.Item>
      </List>)
}

const TestPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(escapeHtml(value))
  }

  return (<Stack>
    <Editor content={'2024 @ Interview'} setValue={()  => console.log('--')}/>  
    <Group>
        <Button onClick={handleSubmit}>Submit</Button>
    </Group>
  </Stack>);
}

const Editor = ({content, setValue}) => {

    const editor = useEditor({
        extensions: [StarterKit, Link, Highlight, Underline],
        content: content,
        onUpdate: ({editor}) => {
            setValue(editor?.getHTML())
        }
      });

    return (<RichTextEditor editor={editor}>

        <RichTextEditor.Toolbar>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.ClearFormatting />
          </RichTextEditor.ControlsGroup>


          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold/>
            <RichTextEditor.Italic/>
            <RichTextEditor.Underline/>
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Strikethrough />
            <RichTextEditor.Highlight />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

          
  
        <RichTextEditor.Content/>
      </RichTextEditor>)
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


 
export default EssentialPage;