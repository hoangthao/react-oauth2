import { useNavigate, useParams } from "react-router-dom";
import { fetchBookWithUnitById } from "./ToeicAPI";
import { useQuery } from "react-query";
import { Divider, List, ThemeIcon, Title, UnstyledButton, rem } from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
import { useState } from "react";
import ToeicTestPage from "./ToeicTestPage";

const ToeicPracticePage = () => {

    const {bookId} = useParams()
    const [ unit, setUnit ] = useState('empty')

    const { data: book, isLoading, error } = useQuery(['practice-book', bookId], () => fetchBookWithUnitById(bookId))

    if (isLoading) return 'Loading...';
    if (error) return `An error occurred ${error.message}`;

    console.log(book)

    const units = book.units?.map((item, idx) => (
        <List.Item key={idx}><UnstyledButton onClick={() => setUnit(item.id)}>{item.title}</UnstyledButton></List.Item>
    ))

    return ( <>
    <Title order={2}>{book.title}</Title>
    <Divider my="md" />
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
    >
        {units}
    </List>
    <Divider my="md" />
    <ToeicTestPage unitId={unit} />
    </> );
}
 
export default ToeicPracticePage;