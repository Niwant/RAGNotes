import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000", // Use environment variable or default to localhost
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials : true
  });

export const createChat = async(newChat : Chat)=>{
 try{
        const response = await axiosInstance.get('/api/chat/' ,newChat,{
            headers: {
              'Content-Type': 'application/json',
            },
          })
        return response.data
    }catch(err){
        console.error('Error in Chat', err)
    }
}

