import { db } from "@/config/db";
import { openrouter } from "@/config/openrouter";
import { ProjectTable, ScreenConfigTable } from "@/config/schema";
import { and, eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_OLD_CODE_LENGTH = 20000;
const MAX_USER_INPUT_LENGTH = 2000;
const MAX_SCREEN_ID_LENGTH = 128;

function isValidUuid(value: string) {
  return UUID_REGEX.test(value);
}

function isNonEmptyString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function sanitizeUserInput(value: string) {
  return value
    .replace(/[`\\]/g, "\\$&")
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeOldCode(value: string) {
  return value.replace(/\r\n/g, "\n").trim();
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { projectId, screenId, oldCode, userInput } = body ?? {};

  const user = await currentUser();
  if (!user?.primaryEmailAddress?.emailAddress) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = user.primaryEmailAddress.emailAddress;

  if (!isNonEmptyString(projectId) || !isValidUuid(projectId.trim())) {
    return NextResponse.json(
      { error: "Invalid or missing projectId" },
      { status: 400 }
    );
  }

  if (!isNonEmptyString(screenId) || screenId.trim().length > MAX_SCREEN_ID_LENGTH) {
    return NextResponse.json(
      { error: "Invalid or missing screenId" },
      { status: 400 }
    );
  }

  if (!isNonEmptyString(oldCode) || oldCode.trim().length > MAX_OLD_CODE_LENGTH) {
    return NextResponse.json(
      { error: "Invalid or missing oldCode" },
      { status: 400 }
    );
  }

  if (!isNonEmptyString(userInput) || userInput.trim().length > MAX_USER_INPUT_LENGTH) {
    return NextResponse.json(
      { error: "Invalid or missing userInput" },
      { status: 400 }
    );
  }

  const normalizedProjectId = projectId.trim();
  const normalizedScreenId = screenId.trim();
  const sanitizedCode = sanitizeOldCode(oldCode);
  const sanitizedUserRequest = sanitizeUserInput(userInput);

  try {
    const projectRows = await db.select().from(ProjectTable).where(eq(ProjectTable.projectId, normalizedProjectId));

    if (!projectRows.length) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    if (projectRows[0].userId !== userId) {
      return NextResponse.json(
        { error: "Forbidden: not authorized to modify this project" },
        { status: 403 }
      );
    }

    const screenRows = await db.select().from(ScreenConfigTable).where(
      and(
        eq(ScreenConfigTable.projectId, normalizedProjectId),
        eq(ScreenConfigTable.screenId, normalizedScreenId)
      )
    );

    if (!screenRows.length) {
      return NextResponse.json(
        { error: "Screen not found" },
        { status: 404 }
      );
    }

    const USER_INPUT = `
Update the following HTML/Tailwind code according to the user request.
Preserve the existing design and style as much as possible.
Do not return a summary or explanation; return only the updated code.

Existing code:
${sanitizedCode}

User request:
${sanitizedUserRequest}
`;

    const aiResult = await openrouter.chat.send({
      chatGenerationParams: {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: USER_INPUT,
          },
        ],
      },
    });

    const code = aiResult?.choices?.[0]?.message?.content;
    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "AI returned invalid code" },
        { status: 502 }
      );
    }

    const updateResult = await db.update(ScreenConfigTable)
      .set({
        code,
      })
      .where(
        and(
          eq(ScreenConfigTable.projectId, normalizedProjectId),
          eq(ScreenConfigTable.screenId, normalizedScreenId)
        )
      )
      .returning();

    if (!updateResult || updateResult.length === 0) {
      return NextResponse.json(
        { error: "Screen not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updateResult[0], { status: 200 });
  } catch (error) {
    console.error("POST /api/edit-screen error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
