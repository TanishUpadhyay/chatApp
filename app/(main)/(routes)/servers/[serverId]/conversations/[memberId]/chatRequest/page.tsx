import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import RadioGroupForm from '@/components/radio-button';
import { currentMember } from "@/lib/current-member";
interface ChatRequestPageProps {
    params: {
      memberId: string;
      serverId: string;
    }
}

  const ChatRequestPage = async ({
    params
  }: ChatRequestPageProps)=>{
    const profile = await currentProfile();
    const member=await currentMember({serverId:params.serverId});
    const memberId = params.memberId;
    const formember_id=member?.id;
    if (!profile) {
        return redirectToSignIn();
    }

    console.log("profile id: "+profile?.id);
    console.log("user id: "+profile?.userId);
    
    console.log("member id: "+member?.id);
    
    const status_data1 = await db.request.findFirst({
        where: {
          from: member?.id,
          to: memberId ,
        }
    });
    const status_data2 = await db.request.findFirst({
        where: {
          from: memberId,
          to: member?.id,
        }
    });

    console.log("one "+status_data1?.from + " "+status_data1?.to + " "+status_data1?.status);

    console.log("two "+status_data2?.from + " "+status_data2?.to + " "+status_data2?.status);
    
      return (
        <RadioGroupForm
          status_data1={status_data1} 
            status_data2={status_data2}
            member_id={memberId}
            member={member}
            formember_id={formember_id}
        />
      );

  }

  export default ChatRequestPage;