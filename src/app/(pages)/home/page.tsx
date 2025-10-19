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
    TextareaAutosize,
    CardActions,
} from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import CommentIcon from '@mui/icons-material/Comment';
import LinkIcon from '@mui/icons-material/Link';

import { 
    useState,
    useEffect,
} from 'react';
import { PostType } from '@/models/Post';

export default function Home(){
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [makePost, setMakePost] = useState<boolean>(false);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [_page, setPage] = useState<number>(1);

    useEffect(() => {
        fetch('/api/post')
              .then(res=>res.json())
              .then(data=>{
                  if(data.ok){
                      setPosts(data.posts);
                      setIsLoading(false);
                  }
              });
    }, []);

    useEffect(() => {
        const onscroll = () => {
          const scrolledTo = window.scrollY + window.innerHeight;
          const isReachBottom = document.body.scrollHeight === scrolledTo;
          if (isReachBottom){
            setPage(prev=>{
                const nextPage = prev + 1;
                fetch(`/api/post?page=${nextPage}`)
                .then(res=>res.json())
                .then(data=>{
                    setPosts(prev => [...prev, ...data.posts]);
                });
                return nextPage;
            });
          }
        };
        window.addEventListener("scroll", onscroll);
        return () => {
          window.removeEventListener("scroll", onscroll);
        };
      }, []);

    const mappedPosts = posts.map((post, i) => {
        const createdAt = new Date(post.createdAt);
        const diffMs = Date.now() - createdAt.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        let date: string;
        if(diffHours > 24){
            date = new Date(post.createdAt).getDay() + ' day(s) ago'; 
        }else{
            date = new Date(post.createdAt).getHours() + 'h ago'; 
        }

        return(
            <Card
            key={i}
            className='p-4'
            >
                <CardHeader
                    sx={{padding: 0}}
                    avatar={
                        <Skeleton
                        variant='circular'
                        width={50}
                        height={50}
                        />
                    }
                    title={
                        <Box>
                            <Typography
                            variant='h6'
                            fontWeight={600}
                            >
                                {post.user.username}
                            </Typography>
                            <Typography
                            sx={{
                                fontSize: '12px',
                            }}
                            fontWeight={400}
                            color='textSecondary'
                            >
                                {date}
                            </Typography>
                        </Box>
                    }
                />
                <CardContent
                sx={{
                    padding: 1,
                }}
                >
                    <ReadMore
                    >
                        {post.caption}
                    </ReadMore>
                    {
                        post.media ? 
                            (
                                <Skeleton 
                                variant='rectangular'
                                height={400}
                                />
                            )
                        :
                            (
                                null
                            )
                    }
                </CardContent>
                <CardContent
                sx={{
                    borderTop: 1,
                    borderColor: 'text.secondary',
                    paddingBottom: '0px !important',
                }}
                >
                <CardActions
                sx={{padding: 0}}
                >
                    <Button
                    className='grow gap-2'
                    sx={{
                        textTransform: 'none',
                    }}
                    >
                        <FavoriteBorderOutlinedIcon />
                        <Typography
                        color='textSecondary'
                        >
                            Like
                        </Typography>
                    </Button>
                    <Button
                    className='grow gap-2'
                    sx={{
                        textTransform: 'none',
                    }}
                    >
                        <CommentIcon 
                        color='action'
                        />
                        <Typography
                        color='textSecondary'
                        >
                            Comment
                        </Typography>
                    </Button>
                    <Button
                    className='grow gap-2'
                    sx={{
                        textTransform: 'none',
                    }}
                    >
                        <LinkIcon
                        color='action'
                        />
                        <Typography
                        color='textSecondary'
                        >
                            Link
                        </Typography>
                    </Button>
                </CardActions>
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
            className='p-4 gap-4 flex flex-col h-fit'
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

function ReadMore({children} : {children: React.ReactNode;}){
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
