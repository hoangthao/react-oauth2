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
    const [email, setEmail] = useState('')
    const login = async (code, next) => {
        const rs = await gitlabAuth(code)
        if (rs.isAuth) {
            setAuthed(true)
            setEmail(rs.email)
            sessionStorage.setItem('loggedIn', true)
            next()
        }
    }
    const logout = async () => {
        const response = await logoutSSO();
        console.log(response)
        if (response) {
            setAuthed(false)
            setEmail('')
            sessionStorage.setItem('loggedIn', false)
        }
    }
    return (
        <AuthContext.Provider value={{
            authed, setAuthed, login, logout, email
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)