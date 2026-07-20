export interface User {
    id: number;
    username: string;
    email: string;
    role: 'player' | 'admin';
}

export interface AuthContextType {
    user: User | null;
    isAuthenticated : boolean;
    loading : boolean;
    userEmail: string;
    sendemail: (email: string) => void;
    login: (email: string, password: string) => boolean;
    logout: () => void;
}