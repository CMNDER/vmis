import {useState,useEffect} from 'react';
import axios from 'axios'
export const HttpRequests=(config,dependency)=>{
    const [urlData,setUrlData]=useState({
        loading:false,
        data:null,
        error:false,
        errorType:null
    });

    useEffect(()=>{
        setUrlData({
            loading:true,
            data:null,
            error:false,
            errorType:null
        });
        axios(config).then(response=>{
        setUrlData({
            loading:false,
            data:response.data,
            error:false,
            errorType:null
        })
    }).catch(error=>{
        setUrlData({
            loading:false,
            data:null,
            error:false,
            errorType:null
        })
    })},[dependency]);
    if(urlData.data!==null && urlData.data!==undefined){
    return urlData
    }
}