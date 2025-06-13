import { S3 } from "@/lib/S3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { z } from "zod";

const uploeadRequestSchema = z.object({
  filename: z.string(),
  contentType: z.string(),
  size: z.number(),
});
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = uploeadRequestSchema.safeParse(body);

    if (!validation.success) {
      console.log("here");
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const { contentType, size } = validation.data;

    const uniqueKey = uuid().toString();

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: uniqueKey,
      ContentType: contentType,
      ContentLength: size,
    });
    const presignedUrl = await getSignedUrl(S3, command, {
      expiresIn: 360,
    });

    const response = {
      presignedUrl,
      key: uniqueKey,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 },
    );
  }
}
