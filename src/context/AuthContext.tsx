import { useNavigate } from "react-router-dom"
import { createContext, useContext, useEffect, useState } from "react"

import { IUser } from "@/types"
import { getCurrentUser } from "@/lib/appwrite/api"

export const INITIAL_USER = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: ""
}

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean
}

type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

// Every context needs children because it wraps the entire app and displays whatever is in it
export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  // INITIALIZATIONS
  const navigate = useNavigate()
  const [user, setUser] = useState<IUser>(INITIAL_USER)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const currentAccount = await getCurrentUser();

      if (currentAccount) {
        setUser({
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio
        })

        setIsAuthenticated(true)

        return true;
      }
    } catch (e) {
      console.log(e)
      return false
    } finally {
      setIsLoading(false)
    }
  };
  // We need to call the checkAuthUser function everytime we load the page so we need the below line:
  // if localStorage does not have any cookies or if local cookies returns as null, renavigate to sign in page and then checkAuthUser()
  useEffect(() => {
    if (
      localStorage.getItem("cookieFallback") === null ||
      localStorage.getItem("cookieFallback") === "[]" ||
      localStorage.getItem("cookieFallback") === undefined
    ) {
      navigate("/sign-in")
    }

    checkAuthUser()
  }, [])
  // empty array dependency makes it so that this runs everytime the app reloads

  const value = {
    user,
    setUser: setUser as () => void,
    isLoading,
    isAuthenticated,
    setIsAuthenticated: () => {},
    checkAuthUser: checkAuthUser as () => Promise<boolean> // Update the type here
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useUserContext = () => useContext(AuthContext)
