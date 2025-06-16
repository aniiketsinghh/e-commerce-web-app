import {create} from "zustand";
import {toast} from "react-hot-toast"
import axios from "../lib/axios.js"
export const useUserStore=create ((set, get)=>({

    user:null,
    loading:false,
    checkingAuth:true,

    signup:async ({name,email,password,confirmPassword})=>{
        set({loading:true});

        if(password !== confirmPassword){
            toast.error("Passwords do not match");
            set({loading:false});
            return;
        }
        
        try {
            const res=await axios.post("/auth/signup",{name,email,password});
            set({user:res.data.user,loading:false});

        } catch (error) {
            set({loading:false});
            toast.error(error.response.data.message|| "An error occured");
        }
   
        
    }}))
    