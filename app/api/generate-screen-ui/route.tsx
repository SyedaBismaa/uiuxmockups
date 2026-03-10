import { db } from "@/config/db";
import { openrouter } from "@/config/openrouter";
import { ScreenConfigTable } from "@/config/schema";
import { GENERATION_SCREEN_PROMPT } from "@/data/prompt";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    const {projectId,screenId, screenName ,purpose,screenDescription, projectVisualDescription} = await req.json();


    const userInput =`
    screen Name is : ${screenName},
    screen Purpose : ${purpose},
    screen Description : ${screenDescription}

    `

   try{
     const aiResult = await openrouter.chat.send({
      chatGenerationParams: {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:GENERATION_SCREEN_PROMPT
          },
          {
            role: "user",
            content: userInput
          }
        ]
      }
    });

    const code = aiResult?.choices[0]?.message?.content;
    const updateResult = await db.update(ScreenConfigTable)
    .set({
        code:code as string
    }).where(and(eq(ScreenConfigTable.projectId,projectId),
    eq(ScreenConfigTable?.screenId,screenId as string)))
    .returning()

    return NextResponse.json(updateResult[0])
   }catch(e){
   return NextResponse.json({msg:"Internal server Error"})
   }
    
}