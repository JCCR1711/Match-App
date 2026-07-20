import { ReactNode, useState } from "react";
import { gmails, gmailsCode } from "../constants/gmails";
import { User } from "../types/auth";
import AuthContext from "./AuthContext";

interface Props {
    children: ReactNode
}

export function AuthProvider({children}: Props) {
    
    const [user, setUser] = useState<User | null>(null);
    const [userEmail, setUserEmail] = useState<string>('');
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!user;//&&!!token

    /*useEffect(() => {
        loadStoredAuth();
    }, []);*/

    const loadStoredAuth = async () => {
        /*try
        {
            const [storedToken, storedUser] = await Promise.all([
                AsyncStorage.getItem('authToken'),
                AsyncStorage.getItem('userData'),
            ]);

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        }
        finally
        {
            setLoading(false);
        }*/
    }

    const sendemail = (email: string) => {
        const code = gmailsCode.find(o => o.email == email);
        setUserEmail(email);
    };

    const login = (email: string, password: string) => {
        try
        {
            setLoading(true);
            const dataUsers = gmails.find(o => o.email == email);
            if (dataUsers)
            {
                setUser(dataUsers);
                return true;   
            } else
                return false;
        }
        catch
        {
            return false;
        }
        finally
        {
            setLoading(false);
        }

    };
    
    const logout = () => {
        setUser(null);
    }

    return(
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                loading,
                userEmail,
                sendemail,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}