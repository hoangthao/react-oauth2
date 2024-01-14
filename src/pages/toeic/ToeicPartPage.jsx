import { Button, Drawer, Group, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowBack, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PartForm from "./ToeicPart/PartForm";
import PartList from "./ToeicPart/PartList";

const ToeicPartPage = () => {
    const { unitId } = useParams()
    const [opened, { open, close }] = useDisclosure(false);
    const [form, setForm] = useState(null)
    const navigate = useNavigate()
   
    const openForm = (data) => {
        console.log('data', data)
        if (data === undefined) {
            setForm({
                id: '', title: '', createdAt: '', updatedAt: '', unitId
            })
        } else {
            setForm(data)
        }
        open()
    }
    return (<>
        <Drawer opened={opened} onClose={close} title="Part Form">

            <PartForm initial={form} />

        </Drawer>
        <Stack>
            <Group>
                <Button leftSection={<IconArrowBack size={14} />}  color='lime' onClick={() => navigate(-1)}>Go back</Button>
                <Button leftSection={<IconPlus size={14} />} onClick={() => openForm()}>Add a part</Button>
            </Group>
            <PartList openForm={openForm} unitId={unitId}/>
        </Stack>
    </>);
}

export default ToeicPartPage;