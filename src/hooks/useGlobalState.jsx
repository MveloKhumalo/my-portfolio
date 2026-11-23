import { createContext, useContext, useState } from 'react';

const GlobalStateContext = createContext(null);

export const GlobalStateProvider = ({ children }) => {

    const [activeSection, setActiveSection] = useState(0);

    const [menuOpen, setMenuOpen] = useState(false);

    const [isTerminalOpen, setIsTerminalOpen] = useState(false);

    const value = {
        activeSection,
        setActiveSection,

        menuOpen,
        setMenuOpen,

        isTerminalOpen,
        setIsTerminalOpen
    };

    return (
        <GlobalStateContext.Provider value={value}>
            {children}
        </GlobalStateContext.Provider>
    );
};


export const useGlobalState = () => {
    return useContext(GlobalStateContext);
};