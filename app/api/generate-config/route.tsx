import { db } from "@/config/db";
import { openrouter } from "@/config/openrouter";
import { ProjectTable, ScreenConfigTable } from "@/config/schema";
import { APP_LAYOUT_CONFIG_PROMPT, GENRATE_NEW_SCREEN_IN_EXISITING_PROJECT_PROJECT } from "@/data/prompt";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    const {userInput, deviceType,projectId, oldScreenDescription,theme} = await req.json();


const aiResult = await openrouter.chat.send({
  chatGenerationParams: {
    model: "openai/gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:oldScreenDescription?
        GENRATE_NEW_SCREEN_IN_EXISITING_PROJECT_PROJECT.replace("{deviceType}", deviceType).replace('{theme}',theme) :
        APP_LAYOUT_CONFIG_PROMPT.replace("{deviceType}", deviceType)
      },
      {
        role: "user",
        content: oldScreenDescription?userInput+"Old screen description is:"+oldScreenDescription : userInput
      }
    ]
  }
});


//save to db

const JSONAIResult=JSON.parse(aiResult?.choices[0]?.message?.content as string)

if(JSONAIResult){
    //upadte project table w nme
 !oldScreenDescription&& await db.update(ProjectTable).set({
    projectVisualDescription:JSONAIResult?.
projectVisualDescription,
projectName:JSONAIResult?.projectName,
theme:JSONAIResult?.theme
}).where(eq(ProjectTable.projectId,projectId as string))

//insert screen config
JSONAIResult.screens?.forEach(async (screen:any)=>{
    const result=await db.insert(ScreenConfigTable).values({
        projectId:projectId,
        purpose:screen?.purpose,
        screenDescription:screen?.layoutDescription,
        screenId:screen?.id,
        screenName:screen?.name

    })
})

return NextResponse.json(JSONAIResult)
}else{
    NextResponse.json({msg:'internal server error'})
}

}



export async function DELETE(req:NextRequest){
  const projectId=req.nextUrl.searchParams.get('projectId');
  const screenId=req.nextUrl.searchParams.get('screenId') 

  const user=await currentUser();

  if(!user){
    return NextResponse.json({msg:'unauthorized'},{status:401})
  }

  const result = await db.delete(ScreenConfigTable)
  .where(and(eq(ScreenConfigTable.screenId,screenId as string ), eq(ScreenConfigTable.projectId,projectId as string)))

  return NextResponse.json({msg:"Deleted"})
}





