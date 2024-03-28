import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const member = url.searchParams.get('member');
    const memberId = url.searchParams.get('memberId');
    console.log('memberId in get is::::' + memberId);
    console.log('member in get is::::' + member);

    

    if (!member) {
      return new NextResponse('Unauthorized ! member not found', { status: 401 });
    }
    const request1 = await db.request.findFirst({
      where: {
        from: Array.isArray(member) ? member[0].id : member,
        to: Array.isArray(memberId) ? memberId[0] : memberId
      }
    });
    const request2 = await db.request.findFirst({
      where: {
        from: Array.isArray(memberId) ? memberId[0] : memberId,
        to: Array.isArray(member) ? member[0] : member
      }
    });

    console.log('request1 is::::' + request1);
    console.log('request2 is::::' + request2);
    
   if(request1 || request2){
    if(request1){
      return NextResponse.json(request1.status);
    }
      return NextResponse.json(request2?.status);
  }

    return NextResponse.json('PENDING');
  } catch (error) {
    console.log('[REQUEST_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
export async function PUT(requ: Request) {
  try {
    const data = await requ.json();
    const { memberId, status, member } = data;

    if (status == 'ACCEPTED') {
      const req = await db.request.findFirst({
        where: {
          from: memberId,
          to: member.id,
        },
      });
      console.log('mem id ' + memberId);
      console.log('mem dot id ' + member.id);

      console.log('req api is: ' + req);

      if (req) {
        const updated_req = await db.request.update({
          where: {
            id: req.id,
          },
          data: {
            status: 'ACCEPTED',
          },
        });
        return NextResponse.json(updated_req);
      }
      return NextResponse.json(req);
    } else if (status == 'DECLINED') {
      const req = await db.request.findFirst({
        where: {
          from: memberId,
          to: member.id,
        },
      });
      if (req) {
        const updated_req = await db.request.update({
          where: {
            id: req.id,
          },
          data: {
            status: 'DECLINED',
          },
        });
        return NextResponse.json(updated_req);
      }

      return NextResponse.json(req);
    }
  } catch (error) {
    console.log('[REQUEST_UPDATE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('data is::::' + data);

    const { memberId, status, member } = data;
    console.log('memberId is::::' + memberId);
    console.log('request is::::' + req.json());

   
    const request = await db.request.create({
      data: {
        from: member.id,
        to: memberId,
        status: 'PENDING',
      },
    });

    return NextResponse.json(request);
  } catch (error) {
    console.log('[REQUEST_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
