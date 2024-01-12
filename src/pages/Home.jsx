import { useEffect } from "react";
import axios from "axios";
import { Button, Text } from '@mantine/core';
import { modals } from '@mantine/modals';

const Home = () => {

    /*
    useEffect(() => {
        const fetchHome = async () => {
            const resp = await axios.get('http://localhost:8080')
            console.log(resp)
        }
        const fetchProducts1 = async () => {
            const auth = {
                username: "user",
                password: "user"
            }
            const resp = await axios.get('http://localhost:8080/products', {auth})
            console.log(resp)
        }
        const fetchProducts2 = async () => {
            const encoded = btoa('user:user')
            const headers = {
                'Authorization': `Basic ${encoded}`
            }
            const resp = await axios.get('http://localhost:8080/products', {headers})
            console.log(resp)
        }
        fetchHome()
        fetchProducts1()
        fetchProducts2()
    }, [])
    */

    const openDeleteModal = () =>
        modals.openConfirmModal({
        title: 'Delete your profile',
        centered: true,
        children: (
            <Text size="sm">
            Are you sure you want to delete your profile? This action is destructive and you will have
            to contact support to restore your data.
            </Text>
        ),
        labels: { confirm: 'Delete account', cancel: "No don't delete it" },
        confirmProps: { color: 'red' },
        onCancel: () => console.log('Cancel'),
        onConfirm: () => console.log('Confirmed'),
    });

    return ( <Button onClick={openDeleteModal} color="red">Delete account</Button> );
}
 
export default Home;