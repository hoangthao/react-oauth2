import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { RichTextEditor } from '@mantine/tiptap';
import { IconBold, IconItalic } from '@tabler/icons-react';
import { Button, Group, Stack } from '@mantine/core';
import { useQuery } from 'react-query';
import { fetchBook } from '../toeic/ToeicAPI';
import { useState } from 'react';

const EssentialPage = () => {

    const [ value, setValue ] = useState('<p>Your initial <b>html value</b> or an empty string to init editor without value</p>')

    const { data: books, isLoading, error } = useQuery(['books'], () => fetchBook())
    if (isLoading) return 'Loading...';
    if (error) return `An error occurred ${error.message}`;

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(value)
    }

    return (<Stack>
        <Editor content={books[0].title} setValue={setValue}/>  
        <Group>
            <Button onClick={handleSubmit}>Submit</Button>
        </Group>
    </Stack>);
}

const Editor = ({content, setValue}) => {

    const editor = useEditor({
        extensions: [StarterKit],
        content: content,
        onUpdate: ({editor}) => {
            setValue(editor?.getHTML())
        }
      });

    return (<RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold icon={() => <IconBold size="1rem" stroke={3.5} />} />
            <RichTextEditor.Italic icon={() => <IconItalic size="1rem" stroke={3.5} />} />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
  
        <RichTextEditor.Content/>
      </RichTextEditor>)
}


 
export default EssentialPage;