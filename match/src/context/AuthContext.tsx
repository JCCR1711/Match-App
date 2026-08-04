import { createContext } from "react";
import { AuthContextType } from "../types/auth";

// interface AuthContextType {
//     isAuthenticated: boolean;
//     login: () => void;
//     logout: () => void;
// }

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
)

export default AuthContext