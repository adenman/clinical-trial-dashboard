import React, { createContext, useState, useContext, useEffect } from 'react';

// All auth scripts now live directly in the /api/ folder
const API_BASE_URL = 'https://adenneal.com/ClinicalTrial/api/';
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}check_session.php`, { credentials: 'include' });
                const data = await response.json();
                if (response.ok && data.loggedIn) {
                    setUser(data.user);
                }
            } catch (error) {
                console.log("No active session found.");
            } finally {
                setLoadingAuth(false);
            }
        };
        checkSession();
    }, []);
    
    const login = async (email, password) => {
        const response = await fetch(`${API_BASE_URL}login.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Login failed.');
        
        setUser(data.user);
    };
    
    // The register function does not need credentials since no session exists yet.
    const register = async (username, email, password) => {
        const response = await fetch(`${API_BASE_URL}register.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Registration failed.');
    };

    const logout = () => {
        setUser(null);
        fetch(`${API_BASE_URL}logout.php`, { credentials: 'include' });
    };

    const value = { user, loadingAuth, login, register, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
