import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser, setError } from '../state/auth.state.js';
import { register,login,getMe } from '../services/auth.service.js';

export function useAuth() {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);

    const handleRegister = async ({ fullName, email, contact, password, isSeller }) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await register({ fullName, email, contact, password, isSeller });
            dispatch(setUser(data?.user || data));
            return data.user
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Registration failed';
            dispatch(setError(errorMsg));
            return { success: false, error: errorMsg };
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleLogin = async({email,password})=>{

        try {

            dispatch(setLoading(true))
            const data = await login({email,password})
            dispatch(setUser(data.user))
            return data.user
            
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Registration failed';
            dispatch(setError(errorMsg))
            return { success : false, error:errorMsg}
        }finally{
            dispatch(setLoading(false))
        }

    }

    const handleGetMe = async()=>{

        try{
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
        }catch(err){
            console.log(err)
        }finally{
            dispatch(setLoading(false))
        }
    }

    return {
        user,
        loading,
        error,
        handleRegister,
        handleLogin,
        handleGetMe
    };
}