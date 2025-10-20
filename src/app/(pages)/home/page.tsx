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
    Skeleton,
    Divider,
    DialogActions,
    Typography,
    TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PostSkeleton from '@/components/PostSkeleton';
import Navbar from '@/components/Navbar';
import PostCard from '@/components/PostCard';
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
    const [hasNext, setHasNext] = useState<boolean>(false);
    const [openedPostId, setOpenedPostId] = useState<string | null>(null);

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
          onOpen={(postId)=>setOpenedPostId(postId)}
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
      setPosts(prev => prev.map(p => 
        p._id === postId
        ? {
          ...p,
          liked: !p.liked,
          likeCount: p.liked ? p.likeCount - 1: p.likeCount + 1
          }
        : p
        ));
      fetch('api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({postId})
      });
    }

    const openedPost = posts.find(post => post._id === openedPostId) || null;

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
              <PostDialog 
              post={openedPost}
              onClose={() => setOpenedPostId(null)}
              onLike={handleLike}
              />
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

interface PostDialogProps{
  post: PostType | null;
  onClose: () => void;
  onLike: (id: string) => void;
}

function PostDialog({post, onClose, onLike}:PostDialogProps){
  if(!post){
    return(
        <Skeleton 
        variant='rectangular'
        height={400}
        />
    );
  }

  return(
    <Dialog
    open={post !== null}
    onClose={onClose}
    maxWidth='sm'
    slotProps={{
      paper: {
        className:'h-full w-full' 
      }
    }}
    >
      <DialogTitle
      className='text-center'
      >
        {post.user.username}{"'"}s Post
      </DialogTitle>
      <Divider orientation='horizontal'/>
      <DialogContent
      sx={{
        padding: '0px'
      }}
      >
        <Box
        className='p-4'
        >
          {post.caption}
        </Box>
        <Divider orientation='horizontal'/>
        <DialogActions>
          <Button
            className="grow gap-2"
            sx={{
              textTransform: "none",
            }}
            onClick={() => onLike(post._id)}
          >
            {
              post.liked ?
                (
                  <FavoriteIcon 
                  sx={{color: 'red'}}
                  />
                )
              :
                (
                  <FavoriteBorderOutlinedIcon color="action" />
                )
            }
            <Typography color="textSecondary">{post.likeCount}</Typography>
          </Button>
          <Button
            className="grow gap-2"
            sx={{
              textTransform: "none",
            }}
          >
            <CommentIcon color="action" />
            <Typography color="textSecondary">Comment</Typography>
          </Button>
          <Button
            className="grow gap-2"
            sx={{
              textTransform: "none",
            }}
          >
            <LinkIcon color="action" />
            <Typography color="textSecondary">Link</Typography>
          </Button>
        </DialogActions>
        <Divider orientation='horizontal'/>
        <Box
        className='p-4'
        >
          NO COMMENTS
          Amet voluptatem enim vero dolorum dolorum excepturi? Obcaecati molestias incidunt quidem ea ea. Dolorem quos deleniti amet odit quod Fugiat velit deserunt fugiat in repudiandae? Possimus ipsa reiciendis non sapiente cumque Delectus sed voluptatibus sit velit totam Recusandae enim maiores hic nulla fugiat Quod atque eius saepe magni voluptates! Minima quia dolores quod dignissimos at Repellendus at reprehenderit nemo adipisci officia, voluptatum Vitae tenetur recusandae aut iste corrupti sint minima In modi facere ipsa est aut eveniet quibusdam? Nesciunt eligendi veritatis facilis officia commodi iusto? Omnis consectetur fugiat minima nostrum quidem. Debitis ullam debitis cumque quaerat fugit! Iure similique inventore magnam quos fugit ad qui Corporis ut minus perferendis dolorem incidunt Placeat adipisci facere a libero voluptatum aut Ducimus corrupti soluta harum assumenda quisquam Voluptatibus eligendi dolore pariatur sunt ad? Incidunt inventore maxime laudantium laborum repudiandae quidem ratione? Eos eius quod sint quia rerum, ex sequi? Ad reiciendis voluptates reiciendis earum facere! Iure impedit labore recusandae dignissimos molestiae facere! Suscipit quam tenetur tenetur esse voluptates adipisci. Adipisci nisi laudantium voluptatibus maxime incidunt Necessitatibus architecto harum atque numquam quibusdam Esse esse ea veniam iusto nostrum? Non beatae delectus eligendi placeat ex blanditiis dolores. Omnis sit cumque totam corrupti laborum magnam saepe Debitis enim voluptate nobis dicta assumenda harum Alias non quas ratione quo soluta incidunt in reprehenderit, voluptas. Quaerat vero quas autem similique hic placeat Hic nihil aliquid id aliquam voluptates. Optio tempora nisi corporis veritatis at sapiente. Dicta architecto obcaecati ipsam dolores illo Cum ut praesentium blanditiis repellat repellendus. Itaque eveniet corporis incidunt natus neque. Totam cupiditate error rem nihil sapiente? Quis voluptatum molestias suscipit velit ipsa consectetur magnam. Sit debitis aut delectus nulla asperiores Omnis harum debitis iusto corrupti saepe Quas assumenda dicta omnis ad expedita autem Est adipisci saepe velit optio iusto Nihil fugiat consectetur ut unde pariatur Fugiat dolores placeat iste a ipsum. Eos reprehenderit voluptas recusandae ipsa impedit sunt perferendis, atque. Temporibus earum autem iste blanditiis facilis. Corrupti porro ea veritatis modi quae, aspernatur? Ab repudiandae blanditiis sapiente corrupti quae, repellendus Quisquam assumenda nobis doloribus cum doloribus? Cum adipisci tenetur eveniet velit recusandae? Deserunt voluptates possimus numquam aliquam sapiente assumenda, pariatur. Nemo possimus ullam minima reprehenderit quis laboriosam Officia perspiciatis quas doloribus ipsum enim Eaque debitis minus consequatur sunt natus accusamus Sit fuga corporis quidem eos harum voluptas odit, ipsum ea! Eum ad enim provident necessitatibus fugit Placeat nostrum sequi laborum nihil asperiores, debitis Quibusdam accusamus adipisci repudiandae labore corrupti Quae saepe recusandae hic dolores aperiam eius illum? Fugiat fugiat praesentium itaque molestias repudiandae! Unde laudantium delectus possimus libero ullam! Soluta eum accusantium id itaque assumenda. Neque rerum et aspernatur labore repellendus. Fugiat excepturi perferendis assumenda blanditiis inventore, reprehenderit vero. Culpa non tempora quaerat iste adipisci! A dolores doloremque libero eum enim? Tempora deserunt placeat ratione voluptas qui. Cupiditate ab ad assumenda fuga voluptates Illum non libero sed culpa animi, consequatur veritatis! A labore ab sit voluptatem sit minus? Ut reiciendis perspiciatis accusamus vero praesentium at. At commodi voluptatibus quae molestias magnam vero. Sint esse sapiente!
        </Box>
      </DialogContent>
      <Divider orientation='horizontal'/>
      <DialogActions>
        <TextField 
        className='w-full'
        />
      </DialogActions>
    </Dialog>
  );
}
