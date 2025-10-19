"use client";

import {
    Skeleton,
    Card,
    CardHeader,
    CardContent,
} from '@mui/material';

export default function PostSkeleton(){
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
