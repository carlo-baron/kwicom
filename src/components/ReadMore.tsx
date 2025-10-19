"use client";
import {
    Typography,
    Container,
} from '@mui/material';
import {
  useState
} from 'react';

export default function ReadMore({children} : {children: React.ReactNode;}){
    const [expanded, setExpanded] = useState<boolean>(false);
    return(
        <Container
        >
            <Typography
            onClick={() => setExpanded(!expanded)}
            sx={expanded ? 
                {
                } 
                : 
                {
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                }
            }
            >
                {children}
            </Typography>
        </Container>
    );
}
