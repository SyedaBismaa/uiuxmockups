"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { UserDetsContext } from '@/context/UserDetsContext';
import { SettingContext } from '@/context/SettingContext';
import { RefreshDataContext } from '@/context/RefreshDataContext';

function Provider({children}: any) {

   const [userDeatils, setuserDeatils] = useState()
   const [settingsDetail , setSettingsDetail]= useState()
   const [refreshData,setRefreshData]=useState()

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
    <SettingContext.Provider  value={{settingsDetail,setSettingsDetail}}>
      <RefreshDataContext.Provider value={{refreshData,setRefreshData}}>
           <div>{children}</div>
      </RefreshDataContext.Provider>
    </SettingContext.Provider>
    </UserDetsContext.Provider>
  )
}

export default Provider