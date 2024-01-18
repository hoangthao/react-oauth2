import { useDisclosure } from '@mantine/hooks';
import { Drawer, Button, Stack, Breadcrumbs, Anchor } from '@mantine/core';
import { useRef, useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import BookForm from './ToeicBook/BookForm';
import BookList from './ToeicBook/BookList';

const ToeicBookPage = () => {

    const [opened, { open, close }] = useDisclosure(false);
    const [ form, setForm ] = useState(null)

    const openForm = (data) => {
        console.log('data', data)
        if (data === undefined) {
            setForm({
                id: '', title: '', createdAt: '', updatedAt: ''
            })
        } else {
            setForm(data)
        }
        open()
    }

    return (<>

        <Drawer opened={opened} onClose={close} title="TOEIC Book">
            <BookForm initial={form}/>
        </Drawer>

        <Stack>
            {/* <Breadcrumbs>
                <Anchor href='#'>List Book</Anchor>
            </Breadcrumbs> */}
            <div><Button leftSection={<IconPlus size={14} />} onClick={() => openForm()}>Add a book</Button></div>
            <BookList openForm={openForm}/>
        </Stack>
    </>);
}





export default ToeicBookPage;