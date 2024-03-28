import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { currentProfile } from "./current-profile";

export const currentMember = async ({serverId}:{serverId:string}) => {
  const profile = await currentProfile();

  if (!profile || !serverId) {
    return null;
  }

  const member = await db.member.findFirst({
    where: {
        serverId: serverId,
        profileId: profile.id,
    }
  });
  
  console.log("fun: "+member?.id);
  
  return member;
}

export const currentMemberId = async ({serverId}:{serverId:string}) => {
    const profile = await currentProfile();
    if (!profile) {
      return null;
    }
    const member = await db.member.findFirst({
      where: {
        serverId: serverId,
        profileId: profile.id,
      },
    });
    console.log("current member id util is::::" + member?.id);
    
    return member?.id;
}