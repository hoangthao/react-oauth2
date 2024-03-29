import { useMutation, useQuery, useQueryClient } from "react-query";
import { ActionIcon, Group, Table } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { truncate } from "lodash";
import { Link } from "react-router-dom";
import { deletePart, fetchPartByUnitId } from "../ToeicAPI";

const PartList = ({openForm, unitId}) => {
    const queryClient = useQueryClient()

    const { data: units, isLoading, error } = useQuery(['parts', unitId], () => fetchPartByUnitId(unitId))

    const mutateDelete = useMutation(
        (id) => deletePart(id),
        {
            onSuccess: (resp) => {
                console.log(resp)
                queryClient.invalidateQueries(['parts', unitId])
            }
        }
    )

    if (isLoading) return 'Loading...';
    if (error) return `An error occurred ${error.message}`;
    if (units.length === 0) return "No result"


    const rows = units.map((element) => (
        <Table.Tr key={element.id}>
            <Table.Td>{truncate(element.id, {length: 10})}</Table.Td>
            <Table.Td><Link to={element.id}>{truncate(element.title, {length: 32})}</Link></Table.Td>
            <Table.Td>{truncate(element.unitId, {length: 10})}</Table.Td>
            <Table.Td>{element.createdAt}</Table.Td>
            <Table.Td>{element.updatedAt}</Table.Td>
            
            <Table.Td>
                <Group>
                    <ActionIcon onClick={() => mutateDelete.mutate(element.id)} color='lime'>
                        <IconTrash />
                    </ActionIcon>
                    <ActionIcon onClick={() => openForm(element)}>
                        <IconPencil />
                    </ActionIcon>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Table>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>ID</Table.Th>
                    <Table.Th>Title</Table.Th>
                    <Table.Th>Unit ID</Table.Th>
                    <Table.Th>Created at</Table.Th>
                    <Table.Th>Updated at</Table.Th>
                    <Table.Th>&nbsp;</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    )
}
 
export default PartList;