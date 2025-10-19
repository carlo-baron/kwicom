"use client";

import {
    Container,
    Typography,
    Box,
    AppBar,
    Avatar,
    IconButton,
    Toolbar,
} from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb';
import SearchIcon from '@mui/icons-material/Search';

export default function Navbar(){
    return(
        <AppBar>
            <Container>
                <Toolbar
                disableGutters
                className='flex justify-between'
                >
                    <Box
                    >
                        <IconButton
                        size='large'
                        >
                            <AdbIcon />
                        </IconButton>
                        <IconButton
                        size='large'
                        >
                            <SearchIcon />
                        </IconButton>
                    </Box>
                    <Box
                    sx={{
                        display: {
                            xs: 'none',
                            sm: 'flex'
                        }
                    }}
                    >
                        <Typography
                        variant='h4'
                        noWrap
                        component='a'
                        href='/home'
                        sx={{
                            fontWeight: 600,
                            letterSpacing: '.3rem', 
                            fontFamily: 'monospace',
                        }}
                        >
                            TRELLITE
                        </Typography>
                    </Box>
                    <Box>
                        <IconButton
                        size='large'
                        sx={{p: 0}}
                        >
                            <Avatar/>
                        </IconButton>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
