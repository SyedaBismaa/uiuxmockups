import { db } from "@/config/db";
import { openrouter } from "@/config/openrouter";
import { ProjectTable, ScreenConfigTable } from "@/config/schema";
import { APP_LAYOUT_CONFIG_PROMPT } from "@/data/prompt";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    const {userInput, deviceType,projectId} = await req.json();


const aiResult = await openrouter.chat.send({
  chatGenerationParams: {
    model: "openai/gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: APP_LAYOUT_CONFIG_PROMPT.replace("{deviceType}", deviceType)
      },
      {
        role: "user",
        content: userInput
      }
    ]
  }
});


//save to db

const JSONAIResult=JSON.parse(aiResult?.choices[0]?.message?.content as string)

if(JSONAIResult){
    //upadte project table w nme
await db.update(ProjectTable).set({
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