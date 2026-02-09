"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { UserDetsContext } from '@/context/UserDetsContext';

function Provider({children}: any) {

   const [userDeatils, setuserDeatils] = useState()
    useEffect(()=>{
        CreateNewUser();
    },[]);

    const CreateNewUser= async ()=>{
        const result= await axios.post('/api/user',{})

        console.log(result.data);
        setuserDeatils(result?.data);
    }

  return (
    <UserDetsContext.Provider value={{userDeatils,setuserDeatils}}>
    <div>{children}</div>
    </UserDetsContext.Provider>
  )
}

export default Provider