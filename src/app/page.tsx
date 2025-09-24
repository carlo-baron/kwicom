"use client";

import { useState } from 'react';

export default function Home() {
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

  function handleSubmit(e){
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });

    fetch('api/users', {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify(formDataObject)
    })
    .then(res => res.json())
    .then(data => {
        setLoggedIn(data.ok);
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
        <form 
        onSubmit={handleSubmit}
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
        </form>
      </div>
  );
}
