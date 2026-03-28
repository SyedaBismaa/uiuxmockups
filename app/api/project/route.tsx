import { db } from "@/config/db";
import { ProjectTable,  ScreenConfigTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const {userInput ,projectId, device}=await req.json();

    const user = await currentUser();

    const result = await db.insert(ProjectTable).values({
        projectId:projectId,
        userId:user?.primaryEmailAddress?.emailAddress as string,
        device: device,
        userInput : userInput
    }).returning();

    return NextResponse.json(result[0]);
      

}


export async function GET(req:NextRequest){
    const projectId= await req.nextUrl.searchParams.get('projectId');
    const user=await currentUser()

   try{
     const result= await db.select().from(ProjectTable)
    .where(and(eq(ProjectTable.projectId,projectId as string),eq(ProjectTable.userId,user?.primaryEmailAddress?.emailAddress as string)))
    
    const ScreenConfig=await db.select().from(ScreenConfigTable)
    .where(eq(ScreenConfigTable.projectId,projectId as string))

    return NextResponse.json({
       projectDetail:result[0],
       screenConfig:ScreenConfig,
    });

   }catch(e){
    return NextResponse.json({msg:'error'});
   }
}

export async function PUT(req:NextRequest){
    try {
        // (1) Authenticate the caller
        const user = await currentUser();
        if (!user?.primaryEmailAddress?.emailAddress) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }
        const userId = user.primaryEmailAddress.emailAddress;

        // (2) Validate the request payload
        const body = await req.json();
        const { projectId, projectName, theme } = body;

        if (!projectId || typeof projectId !== 'string' || projectId.trim() === '') {
            return NextResponse.json(
                { error: 'Invalid or missing projectId' },
                { status: 400 }
            );
        }

        if (!projectName || typeof projectName !== 'string' || projectName.trim() === '') {
            return NextResponse.json(
                { error: 'Invalid or missing projectName' },
                { status: 400 }
            );
        }

        if (!theme || typeof theme !== 'string' || theme.trim() === '') {
            return NextResponse.json(
                { error: 'Invalid or missing theme' },
                { status: 400 }
            );
        }

        // (3) Verify project exists and is owned by the authenticated user
        const existingProject = await db.select().from(ProjectTable)
            .where(eq(ProjectTable.projectId, projectId));

        if (!existingProject || existingProject.length === 0) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        if (existingProject[0].userId !== userId) {
            return NextResponse.json(
                { error: 'Forbidden: you do not own this project' },
                { status: 403 }
            );
        }

        // (4) Update and return with appropriate status
        const result = await db.update(ProjectTable).set({
            projectName: projectName.trim(),
            theme: theme.trim(),
        }).where(eq(ProjectTable.projectId, projectId))
           .returning();

        return NextResponse.json(result[0], { status: 200 });

    } catch (error) {
        console.error('PUT /api/project error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}