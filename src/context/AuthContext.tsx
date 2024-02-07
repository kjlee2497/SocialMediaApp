import { getCurrentUser } from '@/lib/appwrite/api';
import { IUser } from '@/types';
import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export const INITIAL_USER = {
    id: '',
    name: '',
    username: '',
    email: '',
    imageUrl: '',
    bio: ''
};

const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => {},
    setIsAuthenticated: () => {},
    checkAuthUser: async () => false as boolean,
};

const AuthContext = createContext(INITIAL_STATE);

// Every context needs children because it wraps the entire app and displays whatever is in it
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
// INITIALIZATIONS
    const [user, setUser] = useState<IUser>(INITIAL_USER);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
  
    const checkAuthUser = async () => {
        try {
            const currentAccount = await getCurrentUser();

            if(currentAccount) {
                setUser({
                    id: currentAccount.$id,
                    name: currentAccount.name,
                    username: currentAccount.username,
                    email: currentAccount.email,
                    imageUrl: currentAccount.imageUrl,
                    bio: currentAccount.bio
                })

                setIsAuthenticated(true);

                return true;
            }
        } catch(e) {
            console.log(e);
            return false;
        } finally {
            setIsLoading(false);
        }
    };
    // We need to call the checkAuthUser function everytime we load the page so we need the below line:
    // if localStorage does not have any cookies or if local cookies returns as null, renavigate to sign in page and then checkAuthUser()
    useEffect(() => {
        if(
            localStorage.getItem('cookieFallback') === null ||
            localStorage.getItem('cookieFallback') === '[]'
        ) {
            navigate('/sign-in')
        }

        checkAuthUser();
    }, []);
    // empty array dependency makes it so that this runs everytime the app reloads

    const value = {
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser
    }

    return (
        <AuthContext.Provider value={value}>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext)