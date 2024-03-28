"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {  useEffect, useState } from "react"
import { redirect, useParams } from "next/navigation"
import axios from "axios"
import RequestReceived from "./chatRequest/request-received"
import RequestSent from "./chatRequest/request-sent"


const FormSchema = z.object({
    type: z.enum(["Yes", "No"], {
        required_error: "You need to select a notification type.",
    }),
});

interface Props{
    status_data1:any,
    status_data2:any,
    member_id:any,
    member:any
    formember_id:any,
}

export default function RadioGroupForm(props:Props) {
    const {
      status_data1,status_data2,
      member_id:member_id,
      member,
      formember_id,
  }
    =props;

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
      })

    const [status,setStatus] =  useState("");
    const [sentonce,setSentonce] = useState(false);
    const params = useParams();
    
   
    
    useEffect(() => {
      const currentStatus = setInterval(async () => {
        const currStaus = await axios.get(`/api/request-status?member=${formember_id}&memberId=${member_id}`);
        console.log("status is:::"+currStaus.data);
        
        setStatus(currStaus.data);
      }, 3000);
      async function getProfile() {

        if(status_data1){
            if(status_data1.status==="ACCEPTED"){
                setStatus("ACCEPTED");
            }
            else if(status_data1.status==="DECLINED"){
                setStatus("DECLINED");
            }
            else{
                setStatus("SENT");
            }
        }
        else if(status_data2){
            if(status_data2.status==="ACCEPTED"){
                setStatus("ACCEPTED");
            }
            else if(status_data2.status==="DECLINED"){
                setStatus("DECLINED");
            }
            else{
                setStatus("RECEIVED");
            }
        }
      }
      // onMemberIdChange(member_id);
      console.log("b eff");
      
      getProfile();
      return () => clearInterval(currentStatus);
      
    }, [status, status_data1, status_data2, member_id, member]);

    async function onRequestAccpted(data: z.infer<typeof FormSchema>) {
        if (data.type === "Yes") {
            const postData = {
              memberId: member_id,
              status: 'ACCEPTED',
              member: member
            };
            axios.put('/api/request-status',postData).then((res)=>{
              if(!res.data){
                setStatus("RECEIVED")
              
              }
              else{
                setStatus("ACCEPTED");
                // setAccepted(true);
              }
            }
            )
            
            
        }

        if(data.type==="No"){
            const postData = {
              memberId: member_id,
              status: 'DECLINED',
              member: member
            };
            axios.put('/api/request-status', postData)

            setStatus("DECLINED");
        }

    }
    async function onRequestSent(data: z.infer<typeof FormSchema>) {
        if (data.type === "Yes") {
            const postData = {
              memberId: member_id,
              status: 'PENDING',
              member: member
            };
            console.log("member_id is:::"+member_id);
            
            axios.post('/api/request-status', postData)
            setStatus("SENT");
            setSentonce(true);
        }
    }
 
    if (status === 'ACCEPTED') {
      

        redirect(`/servers/${params?.serverId}/conversations/${params?.memberId}`);
      
      } else if (status === 'DECLINED') {
        return (
          <div>
            <h1>Chat Request Declined</h1>
          </div>
        );
      } else if (status === 'SENT') {
        
        return  (
          <div>
            <h1>Chat Request SENT</h1>
          </div>
        );
        
      } else if (status === 'RECEIVED') {
        return <RequestReceived onRequestReceived={onRequestAccpted} />;
      } else {
        if(sentonce){
          return  (
            <div>
              <h1>Chat Request SENT</h1>
            </div>
          );
        }
        return <RequestSent onRequestSent={onRequestSent} />;
      }
  
}

