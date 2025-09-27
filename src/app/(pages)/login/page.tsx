"use client";

import { useState } from 'react';
import {
  Button,
  Typography,
  Container,
  TextField,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { useRouter } from 'next/navigation';

export default function Login() {
    const [register, setRegister] = useState<boolean>(false);
    const router = useRouter();

  function handleLogin(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const formDataObject: {[key: string]: FormDataEntryValue } = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });

    fetch('/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify(formDataObject)
    })
    .then(res => res.json())
    .then(data => {
        if(data.ok){
            router.push('/home');
        }
    })
    .catch(err => console.log(err));
  }

  function handleRegister(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const formDataObject: {[key: string]: FormDataEntryValue } = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });

    fetch('/api/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify(formDataObject)
    })
    .then(res => res.json())
    .then(data => {
        if(data.ok){
            setRegister(false);
        }
    })
    .catch(err => console.log(err));
  }

    const handleOpen = () => setRegister(true);
    const handleClose = () => setRegister(false);

  return (
    <Container
      maxWidth="xs"
      sx={{
        p: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          minHeight: "80%",
        }}
      >
        <Typography variant="h4" align="center" fontWeight={700}>
          Welcome to Trellite
        </Typography>

        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
          onSubmit={handleLogin}
        >
          <TextField name="username" label="Username" variant="outlined" required />
          <TextField name="password" label="Password" type="password" variant="outlined" required />
          <Button type="submit" variant="contained" size="large">
            Login
          </Button>
          <Button 
          variant="outlined"
          size="large"
          onClick={handleOpen}
          >
            Register
          </Button>
          <Dialog
          open={register}
          onClose={handleClose}
          >
              <DialogTitle>
              Register Form
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
                  onSubmit={handleRegister}
                >
                    <TextField
                    name="username"
                    label="Username"
                    required
                    />
                    <TextField
                    name="password"
                    label="Password"
                    type='password'
                    required
                    />
                    <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    >
                    Register
                    </Button>
                </Box>
              </DialogContent>
          </Dialog>
        </Box>

        <Typography
          color="text.secondary"
          variant="caption"
          align="center"
        >
          Your information is safe with us.
        </Typography>
      </Paper>
    </Container>
  );
}

function Backdrop({children, onClick}:
{
    children: React.ReactNode;
    onClick?: () => void
}){
    return(
        <div 
        className="backdrop-blur-xl flex items-center justify-center absolute h-screen w-full"
        onClick={onClick}
        >
            {children}
        </div>
    );
}

function Form(
    {
        children = null,
        onSubmit,
    }
    :
    {
        children?: React.ReactNode;
        onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    }
){
    return(
        <form 
        onSubmit={onSubmit}
        onClick={(e)=>e.stopPropagation()}
        method="post"
        className="flex flex-col items-center justify-center w-[50%] h-[50%] outline-solid"
        >
            <label htmlFor="username">Username: </label>
            <input 
            className="rounded-lg border-solid border-2"
            type="text" name="username" required/>
            <label htmlFor="password">Password: </label>
            <input 
            className="rounded-lg border-solid border-2"
            type="password" name="password" required/>
            <input 
            className="px-4 py-1 bg-blue-500 rounded-lg mt-2"
            type="submit" value="Submit" />
            {children}
        </form>
    );
}
