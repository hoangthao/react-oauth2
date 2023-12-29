import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({children}) => {

    const { authed } = useAuth()

    if (!authed) {
        return <Navigate to={'/login'} replace/>
    }
    return children;
}
 
export default ProtectedRoute;