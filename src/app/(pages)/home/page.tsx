"use client";

import {
    Container,
    Typography,
    Button,
    Box,
    AppBar,
    Avatar,
    IconButton,
    Toolbar,
    Skeleton,
    Card,
    CardHeader,
    CardContent,
} from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb';
import SearchIcon from '@mui/icons-material/Search';
import { 
    useState,
} from 'react';

export default function Home(){
    const [isLoading, setIsLoading] = useState<boolean>(true);
    return(
        <Container
        >
            <Navbar />
            <Toolbar />
            <Container
            maxWidth='sm'
            className='gap-4 flex flex-col pt-4 pb-4  h-fit'
            disableGutters
            >
                {
                    isLoading ?
                        (
                            <>
                            <PostSkeleton />
                            <PostSkeleton />
                            </>
                        )
                        :
                        (
                            null
                        )
                }
            </Container>
        </Container>
    );
}

function PostSkeleton(){
    return(
        <Card
        >
            <CardHeader
                avatar={
                    <Skeleton
                    variant='circular'
                    width={50}
                    height={50}
                    />
                }
                title={
                    <Skeleton 
                    variant='text'
                    height={10}
                    width='80%'
                    style={{ marginBottom: 6 }}
                    />
                }
                subheader={
                    <Skeleton 
                    variant='text'
                    height={10}
                    width='40%'
                    />
                }
            />
            <Skeleton 
            variant='rectangular'
            height={400}
            />
            <CardContent>
                <Skeleton 
                variant='text'
                height={10}
                style={{
                    marginBottom: 6
                }}
                width='100%'
                />
                <Skeleton 
                variant='text'
                height={10}
                width='70%'
                />
            </CardContent>
        </Card>
    );
}

function Navbar(){
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
