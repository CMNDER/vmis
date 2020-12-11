import {useEffect, useState} from 'react'
import axios from 'axios'

export function GetOrgUnits(url){
    
    const [request, setRequest] = useState({
        data: null,
        loading:false,
        error: false,
        error_type:null,
    })

    useEffect(() => {
        setRequest({
            data: null,
            loading:true,
            error: false,
            error_type:null,

        })
        if(url.includes("null") || url.includes("undefined")){
        }
        else{
        axios.get(url,{auth:{
            username:'admin',
            password:'district'
        }})
            .then(response => {
                if (response.data !==null){
                setRequest({
                    data: response.data,
                    loading:false,
                    error: false,
                    error_type:null,

                })
            }
            })
            .catch(e => {
                setRequest({
                    data: null,
                    loading:false,
                    error: true,
                    error_type:e,
                })
            })
        }
    }, [url])
    if(request!==null){
    return request
    }
}
