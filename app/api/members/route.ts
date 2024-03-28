import { db } from '@/lib/db';
import { currentMember } from '@/lib/current-member';
import { NextRequest ,NextResponse } from 'next/server';
export async function GET(req: NextRequest) {
    try {
      const url = new URL(req.url);
      const serverId = url.searchParams.get('serverId');
      const channelId = url.searchParams.get('channelId');
      const member = await currentMember({ serverId: serverId || '' });
      console.log("serverId in get members is::::" + serverId);
      
  
      if (!member) {
        return new NextResponse('Unauthorized ! member not found', { status: 401 });
      }
      
      const members = await db.member.findMany({
        where: {
          serverId: serverId || '',
          NOT: {
            id : member.id
          }
        },
        include: {
            profile: true
        }

      });
  
      if(!members){
        return NextResponse.json('No members found');
      }
        return NextResponse.json(members);
    } catch (error) {
      console.log('[REQUEST_GET_MEMBERS]', error);
      return new NextResponse('Internal Error', { status: 500 });
    }
  }

