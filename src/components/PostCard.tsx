"use client";

import {
    Typography,
    Button,
    Box,
    Card,
    Skeleton,
    CardHeader,
    CardContent,
    CardActions,
    Divider,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import CommentIcon from '@mui/icons-material/Comment';
import LinkIcon from '@mui/icons-material/Link';
import { PostType } from '@/models/Post';
import ReadMore from './ReadMore';

interface PostCardProps{
  post: PostType;
  onLike: (id: string) => void;
  onOpen: (postId: string) => void;
}

export default function PostCard({post, onLike, onOpen}:PostCardProps) {
  const createdAt = new Date(post.createdAt);
  const diffMs = Date.now() - createdAt.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  let date: string;
  if(diffHours > 24){
      date = new Date(post.createdAt).getDay() + ' day(s) ago'; 
  }else{
      date = new Date(post.createdAt).getHours() + 'h ago'; 
  }

  return (
    <Card 
    className="p-4"
    raised 
    >
      <CardHeader
        sx={{ padding: 0 }}
        avatar={<Skeleton variant="circular" width={50} height={50} />}
        title={
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {post.user.username}
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
              }}
              fontWeight={400}
              color="textSecondary"
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
        <ReadMore>{post.caption}</ReadMore>
        {post.media ? <Skeleton variant="rectangular" height={400} /> : null}
      </CardContent>
      <Divider orientation="horizontal" />
      <CardContent
        sx={{
          paddingBottom: "0px !important",
        }}
      >
        <CardActions sx={{ padding: 0 }}>
          <Button
            className="grow gap-2"
            sx={{
              textTransform: "none",
            }}
            onClick={()=>onLike(post._id)}
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
            onClick={() => onOpen(post._id)}
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
        </CardActions>
      </CardContent>
    </Card>
  );
}
