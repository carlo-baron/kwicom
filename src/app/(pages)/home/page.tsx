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
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    TextareaAutosize
} from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { 
    useState,
    useEffect,
} from 'react';

export default function Home(){
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [makePost, setMakePost] = useState<boolean>(false);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('/api/post')
              .then(res=>res.json())
              .then(data=>{
                  console.log(data.posts);
                  setPosts(data.posts);
                  setIsLoading(false);
              });
    }, []);

    const mappedPosts = posts.map((post, i) => {
        return(
            <Card
            key={i}
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
                        <Typography
                        variant='h6'
                        fontWeight={600}
                        >
                            {post.user.username}
                        </Typography>
                    }
                    subheader={
                        <Typography
                        >
                            {post.caption}
                        </Typography>
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
    });
    mappedPosts.push(<PostSkeleton key={Date.now()}/>);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault(); 
        const form = e.currentTarget;
        const formData = new FormData(form);

        const formDataObject: {[key: string]: FormDataEntryValue } = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });

        fetch('/api/post', {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify(formDataObject)
        })
            .then(res=>res.json())
            .then(data => {
                if(data.ok){
                    setMakePost(false);
                }
            });
    }

    return(
        <Container
        disableGutters
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
                            mappedPosts
                        )
                }
            </Container>
            <Fab
            color='secondary'
            style={{
                position: 'fixed',
                right: 16,
                bottom: 16,
            }}
            onClick={() => setMakePost(true)}
            >
                <AddIcon/>
            </Fab>
            <Dialog
            open={makePost}
            onClose={()=> setMakePost(false)}
            fullWidth
            maxWidth='sm'
            >
                <DialogTitle>
                    Make Post
                </DialogTitle>
                <DialogContent>
                    <Box
                      component="form"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        mt: 1,
                      }}
                      onSubmit={handleSubmit}
                    >
                        <TextareaAutosize
                        name="caption"
                        placeholder="Caption"
                        minRows={3}
                        maxRows={5}
                        required
                        />
                        <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        >
                        Post
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
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
