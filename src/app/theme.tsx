"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
    LightMode,
    DarkMode,
} from '@mui/icons-material';
import {
    Button,
} from '@mui/material';
import { 
    useState,
    useEffect
} from 'react';


export default function ThemeRegistry({ children }: { children: React.ReactNode; }) {
    const [isLight, setIsLight] = useState<boolean>(false);
    const [mounted, setMounted] = useState<boolean>(false);
    const theme = createTheme({
      palette: {
        mode: isLight ? "light" : "dark",
      },
    });

    useState(()=>{
        setMounted(true);
    },[]);

    if(!mounted){
        return(
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {children}
            </ThemeProvider>
        );
    }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Button
      variant={ isLight ? "contained" : "outlined" }
      size="small"
      sx={{
        p: 1,
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        width: 'fit-content',
        height: 'fit-content',
        zIndex: 10000,
      }}
      onClick={() => setIsLight(!isLight)}
      >
        {
            isLight ?
                <LightMode />
            :
                <DarkMode />
        }
      </Button>
      {children}
    </ThemeProvider>
  );
}


