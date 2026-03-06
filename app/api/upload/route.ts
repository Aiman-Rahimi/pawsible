// app/api/upload/route.ts
import { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { ok, err, requireRole } from "@/lib/api";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const { response } = await requireRole(["ADMIN", "MODERATOR"]);
  if (response) return response;

  try {
    const formData = await req.formData();
    const file     = formData.get("file") as File;
    if (!file) return err("No file provided");

    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "pawsible/pets", resource_type: "image", transformation: [{ width: 800, crop: "limit" }] },
          (error, result) => {
            if (error || !result) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    return ok({ url: result.secure_url });
  } catch (e) {
    console.error(e);
    return err("Upload failed", 500);
  }
}
