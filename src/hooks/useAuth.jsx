import { createContext, useContext, useState } from 'react'
import gitlabAuth from '../api/GitlabClient';

const AuthContext = createContext();


const logoutSSO = async () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Logged Out')
        }, 300)
    })
}

export const AuthProvider = ({children}) => {
    const loggedIn = JSON.parse(sessionStorage.getItem('loggedIn'))
    const [authed, setAuthed] = useState(loggedIn)
    const login = async (code, next) => {
        const rs = await gitlabAuth(code)
        if (rs.isAuth) {
            const data = {
                isAuthed: true,
                email: rs.email
            }
            setAuthed(data)
            sessionStorage.setItem('loggedIn', JSON.stringify(data))
            next()
        }
    }
    const logout = async () => {
        const response = await logoutSSO();
        console.log(response)
        if (response) {
            const data = {
                isAuthed: false
            }
            setAuthed(data)
            sessionStorage.setItem('loggedIn', JSON.stringify(data))
        }
    }
    return (
        <AuthContext.Provider value={{
            authed, setAuthed, login, logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)