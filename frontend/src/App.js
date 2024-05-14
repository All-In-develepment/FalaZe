import React, { useState, useEffect } from "react";

import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "react-query";

import { ptBR } from "@material-ui/core/locale";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";
import ColorModeContext from "./layout/themeContext";
import { config } from "dotenv";

import Routes from "./routes";

config();

const queryClient = new QueryClient();

const App = () => {
    const [locale, setLocale] = useState();

    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const preferredTheme = window.localStorage.getItem("preferredTheme");
    const [mode, setMode] = useState(preferredTheme ? preferredTheme : prefersDarkMode ? "dark" : "light");

    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
            },
        }),
        []
    );

    let theme = null;
    if (process.env.REACT_APP_PROJECT_NAME === "FalaTU")
    {
        theme = createTheme(
            {
                scrollbarStyles: {
                    "&::-webkit-scrollbar": {
                        width: '8px',
                        height: '8px',
                    },
                    "&::-webkit-scrollbar-thumb": {
                        boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
                        backgroundColor: "#6D30EF",
                    },
                },
                scrollbarStylesSoft: {
                    "&::-webkit-scrollbar": {
                        width: "8px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: mode === "light" ? "#F3F3F3" : "#333333",
                    },
                },
                palette: {
                    type: mode,
                    primary: { main: mode === "light" ? "#6D30EF" : "#FFFFFF" },
                    textPrimary: mode === "light" ? "#6D30EF" : "#FFFFFF",
                    borderPrimary: mode === "light" ? "#6D30EF" : "#FFFFFF",
                    dark: { main: mode === "light" ? "#333333" : "#F3F3F3" },
                    light: { main: mode === "light" ? "#F3F3F3" : "#333333" },
                    tabHeaderBackground: mode === "light" ? "#EEE" : "#666",
                    optionsBackground: mode === "light" ? "#fafafa" : "#333",
                    options: mode === "light" ? "#fafafa" : "#666",
                    fontecor: mode === "light" ? "#128c7e" : "#fff",
                    fancyBackground: mode === "light" ? "#fafafa" : "#333",
                    bordabox: mode === "light" ? "#eee" : "#333",
                    newmessagebox: mode === "light" ? "#eee" : "#333",
                    inputdigita: mode === "light" ? "#fff" : "#666",
                    contactdrawer: mode === "light" ? "#fff" : "#666",
                    announcements: mode === "light" ? "#ededed" : "#333",
                    login: mode === "light" ? "#fff" : "#1C1C1C",
                    announcementspopover: mode === "light" ? "#fff" : "#666",
                    chatlist: mode === "light" ? "#eee" : "#666",
                    boxlist: mode === "light" ? "#ededed" : "#666",
                    boxchatlist: mode === "light" ? "#ededed" : "#333",
                    total: mode === "light" ? "#fff" : "#222",
                    messageIcons: mode === "light" ? "grey" : "#F3F3F3",
                    inputBackground: mode === "light" ? "#FFFFFF" : "#333",
                    barraSuperior: mode === "light" ? "linear-gradient(to right, #6D30EF, #6D30EF , #6D30EF)" : "#666",
                    boxticket: mode === "light" ? "#EEE" : "#666",
                    campaigntab: mode === "light" ? "#ededed" : "#666",
                    mediainput: mode === "light" ? "#ededed" : "#1c1c1c",
                },
                mode,
            },
            locale
        );
    }else{
        theme = createTheme(
            {
                scrollbarStyles: {
                    "&::-webkit-scrollbar": {
                        width: '8px',
                        height: '8px',
                    },
                    "&::-webkit-scrollbar-thumb": {
                        boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
                        backgroundColor: "#081C34",
                    },
                },
                scrollbarStylesSoft: {
                    "&::-webkit-scrollbar": {
                        width: "8px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: mode === "light" ? "#D9D9D9" : "#39495D",
                    },
                },
                palette: {
                    type: mode,
                    primary: { main: mode === "light" ? "#081C34" : "#040E1A" },
                    textPrimary: mode === "light" ? "#081C34" : "#040E1A",
                    borderPrimary: mode === "light" ? "#081C34" : "#040E1A",
                    dark: { main: mode === "light" ? "#39495D" : "#D9D9D9" },
                    light: { main: mode === "light" ? "#D9D9D9" : "#39495D" },
                    tabHeaderBackground: mode === "light" ? "#C3C3C3" : "#6D6D6D",
                    optionsBackground: mode === "light" ? "#FAFAFA" : "#39495D",
                    options: mode === "light" ? "#FAFAFA" : "#6D6D6D",
                    fontecor: mode === "light" ? "#0B7D39" : "#040E1A",
                    fancyBackground: mode === "light" ? "#FAFAFA" : "#39495D",
                    bordabox: mode === "light" ? "#C3C3C3" : "#39495D",
                    newmessagebox: mode === "light" ? "#C3C3C3" : "#39495D",
                    inputdigita: mode === "light" ? "#040E1A" : "#6D6D6D",
                    contactdrawer: mode === "light" ? "#040E1A" : "#6D6D6D",
                    announcements: mode === "light" ? "#EDEDED" : "#39495D",
                    login: mode === "light" ? "#040E1A" : "#1C1C1C",
                    announcementspopover: mode === "light" ? "#040E1A" : "#6D6D6D",
                    chatlist: mode === "light" ? "#C3C3C3" : "#6D6D6D",
                    boxlist: mode === "light" ? "#EDEDED" : "#6D6D6D",
                    boxchatlist: mode === "light" ? "#EDEDED" : "#39495D",
                    total: mode === "light" ? "#040E1A" : "#222",
                    messageIcons: mode === "light" ? "grey" : "#D9D9D9",
                    inputBackground: mode === "light" ? "#040E1A" : "#39495D",
                    barraSuperior: mode === "light" ? "linear-gradient(to right, #081C34, #081C34 , #081C34)" : "#6D6D6D",
                    boxticket: mode === "light" ? "#C3C3C3" : "#6D6D6D",
                    campaigntab: mode === "light" ? "#EDEDED" : "#6D6D6D",
                    mediainput: mode === "light" ? "#EDEDED" : "#1C1C1C",
                },
                mode,
            },
            locale
        );
    }

    useEffect(() => {
        const i18nlocale = localStorage.getItem("i18nextLng");
        const browserLocale =
            i18nlocale.substring(0, 2) + i18nlocale.substring(3, 5);

        if (browserLocale === "ptBR") {
            setLocale(ptBR);
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem("preferredTheme", mode);
    }, [mode]);



    return (
        <ColorModeContext.Provider value={{ colorMode }}>
            <ThemeProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                    <Routes />
                </QueryClientProvider>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export default App;
