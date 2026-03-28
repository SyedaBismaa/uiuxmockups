"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { UserDetsContext } from '@/context/UserDetsContext';
import { SettingContext } from '@/context/SettingContext';

function Provider({children}: any) {

   const [userDeatils, setuserDeatils] = useState()
   const [settingDetail,setSettingDetail]=useState();

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
      <SettingContext.Provider value={{settingDetail,setSettingDetail}}>
    <div>{children}</div>
    </SettingContext.Provider>
    </UserDetsContext.Provider>
  )
}

export default Provider