    
import axios from 'axios'

const api = axios.create({
    baseURL:'/api/auth',
    withCredentials:true
})

export async function register({ fullName, email, contact, password, isSeller = false }) {
    const res = await api.post('/register', {
        fullName,
        email,
        contact,
        password,
        isSeller
    })
    
    return res.data
}

export async function login({ email, password }) {
    const res = await api.post('/login', {
        email,password
    })
    return res.data
}

export async function getMe() {
    
    const res = await api.get('/me')

    return res.data
}