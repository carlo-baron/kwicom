"use client";

import { useState } from 'react';

export default function Home() {
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [register, setRegister] = useState<boolean>(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>){
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
            setLoggedIn(true);
            fetch('/api/users')
            .then(res=>res.json())
            .then(data=>console.log(data));
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

  return (
      <div className="p-4 flex flex-col items-center justify-center w-full h-screen">
        <h1 className="text-4xl font-bold text-center mb-4">
            {
                loggedIn ? "You are In" : "You are Out"
            }
        </h1>
        <Form
        onSubmit={handleSubmit}
        >
        <button
        className="px-4 py-1 bg-blue-500 rounded-lg mt-2"
        onClick={()=>setRegister(true)}
        >
        Register
        </button>
        </Form>
        {
            register ?
            (
                <Backdrop
                onClick={() => setRegister(false)}
                >
                    <Form
                    onSubmit={handleRegister}
                    />
                </Backdrop>
            )
            :
            (
                null
            )
        }
      </div>
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
