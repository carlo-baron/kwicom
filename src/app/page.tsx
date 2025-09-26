"use client";

import {
    Container,
    Typography,
    Button,
} from '@mui/material';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';

export default function App(){
    const router = useRouter();
    return(
        <Container
        className="flex flex-col items-center justify-center w-full h-screen"
        >
            <Typography
            component={motion.h4}
            initial={{
                opacity: 0,
                y: -100,
            }}
            animate={{
                opacity: 1,
                y: 0
            }}
            transition={{duration: 0.8}}
            variant='h4'
            >
                Welcome To Trellite
            </Typography>
            <Button
            component={motion.button}
            variant='contained'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 1, delay: 0.5}}
            onClick={() => router.push('/login')}
            >
            Login
            </Button>
        </Container>
    );
}
