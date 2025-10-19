"use client";

import {
    Container,
    Button,
    Box,
    Toolbar,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    TextareaAutosize,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PostSkeleton from '@/components/PostSkeleton';
import Navbar from '@/components/Navbar';
import PostCard from '@/components/PostCard';

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
    const [hasNext, setHasNext] = useState<boolean>(false);

    useEffect(() => {
        fetch('/api/post')
              .then(res=>res.json())
              .then(data=>{
                  if(data.ok){
                      setPosts(data.posts);
                      setIsLoading(false);
                      setHasNext(data.hasNext);
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
                    setHasNext(data.hasNext);
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
        return(
          <PostCard 
          key={i}
          post={post}
          onLike={handleLike}
          />
        ); 
    });

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

    function handleLike(postId: string){
      fetch('api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({postId})
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
                {
                  hasNext ?
                    (
                      <PostSkeleton key={Date.now()}/>
                    )
                  :
                    null
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

