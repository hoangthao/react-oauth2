import { Button, Drawer, Group, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowBack, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UnitForm from "./ToeicUnit/UnitForm";
import UnitList from "./ToeicUnit/UnitList";

const ToeicUnitPage = () => {
    const { bookId } = useParams()
    const [opened, { open, close }] = useDisclosure(false);
    const [form, setForm] = useState(null)
    const navigate = useNavigate()

    const openForm = (data) => {
        console.log('data', data)
        if (data === undefined) {
            setForm({
                id: '', title: '', createdAt: '', updatedAt: '', bookId
            })
        } else {
            setForm(data)
        }
        open()
    }
    return (<>
        <Drawer opened={opened} onClose={close} title="Unit Form">

            <UnitForm initial={form} />

        </Drawer>
        <Stack>
            <Group>
                <Button leftSection={<IconArrowBack size={14} />}  color='lime' onClick={() => navigate(-1)}>Go back</Button>
                <Button leftSection={<IconPlus size={14} />} onClick={() => openForm()}>Add an unit</Button>
            </Group>
            <UnitList openForm={openForm} bookId={bookId}/>
        </Stack>
    </>);
}

export default ToeicUnitPage;