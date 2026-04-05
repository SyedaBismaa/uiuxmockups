import { db } from "@/config/db";
import { openrouter } from "@/config/openrouter";
import { ScreenConfigTable } from "@/config/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    const {projectId, screenId,oldCode,userInput}=await req.json();

    const USER_INPUT=`
    ${oldCode} Make Chnagesas per user input  in this code, Keeping Design and style same. Do not chnage it. Just make user requested changes and do not provide any type of summary in text form.UserInput is:  
    `+userInput;

     try{
         const aiResult = await openrouter.chat.send({
          chatGenerationParams: {
            model: "openai/gpt-4o-mini",
            messages: [
            
              {
                role: "user",
                content: USER_INPUT
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