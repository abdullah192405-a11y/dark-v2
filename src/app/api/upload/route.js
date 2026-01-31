import { createClient } from "@/lib/superbase";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import Busboy from "busboy";

export const dynamic = 'force-dynamic';
export const config = {
  api: {
    bodyParser: false,
  },
};

async function verifyClerkSession() {
  try {
    const cookieStore = await cookies();
    // Check if Clerk session cookie exists
    const sessionToken = cookieStore.get('__session')?.value;
    
    if (!sessionToken) {
      return null;
    }

    // Verify with Clerk's API if needed
    // For now, just check that the session exists
    return sessionToken;
  } catch (error) {
    console.error("[API Upload] Session verification error:", error.message);
    return null;
  }
}

export async function POST(request) {
  try {
    // Verify user is authenticated via Clerk session
    const session = await verifyClerkSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - no session found" },
        { status: 401 }
      );
    }

    console.log(`[API Upload] Authenticated, processing upload...`);

    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { success: false, error: "Content-Type must be multipart/form-data" },
        { status: 400 }
      );
    }

    return new Promise((resolve, reject) => {
      const bb = Busboy({
        headers: {
          'content-type': contentType,
        },
        limits: {
          fileSize: 150 * 1024 * 1024, // 150MB
        },
      });

      let fileBuffer = null;
      let fileName = '';
      let fileMimeType = '';
      let folder = 'site-data';

      bb.on('file', (fieldname, file, info) => {
        console.log(`[API Upload] Received file: ${info.filename}, mime: ${info.mimeType}`);
        fileName = info.filename;
        fileMimeType = info.mimeType;

        const chunks = [];
        let totalSize = 0;

        file.on('data', (data) => {
          chunks.push(data);
          totalSize += data.length;
          if (totalSize % (10 * 1024 * 1024) === 0) { // Log every 10MB
            console.log(`[API Upload] Received: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
          }
        });

        file.on('end', () => {
          fileBuffer = Buffer.concat(chunks);
          console.log(`[API Upload] File complete: ${(fileBuffer.length / 1024 / 1024).toFixed(2)}MB`);
        });

        file.on('error', (err) => {
          console.error(`[API Upload] File stream error:`, err.message);
          reject(err);
        });
      });

      bb.on('field', (fieldname, val) => {
        if (fieldname === 'folder') {
          folder = val;
        }
      });

      bb.on('error', (err) => {
        console.error(`[API Upload] Busboy parse error:`, err.message);
        reject(err);
      });

      bb.on('close', async () => {
        try {
          if (!fileBuffer) {
            throw new Error('No file received');
          }

          const maxSize = 150 * 1024 * 1024;
          if (fileBuffer.length > maxSize) {
            return resolve(NextResponse.json(
              { 
                success: false, 
                error: `File size too large. Max 150MB (Current: ${(fileBuffer.length / 1024 / 1024).toFixed(2)}MB)` 
              },
              { status: 413 }
            ));
          }

          const cookieStore = await cookies();
          const supabase = createClient(cookieStore);

          // Get file extension and create unique name
          const fileExtension = fileName.split(".").pop() || 'bin';
          const newFileName = `${folder}-${Date.now()}-${uuidv4()}.${fileExtension}`;
          const filePath = `${folder}/${newFileName}`;

          console.log(`[API Upload] Uploading to Supabase: ${newFileName}`);

          const { data, error: uploadError } = await supabase.storage
            .from("car-images")
            .upload(filePath, fileBuffer, {
              contentType: fileMimeType || 'application/octet-stream',
              cacheControl: "3600",
              upsert: false,
            });

          if (uploadError) {
            console.error("[API Upload] Supabase error:", uploadError.message);
            return resolve(NextResponse.json(
              { success: false, error: `Upload error: ${uploadError.message}` },
              { status: 500 }
            ));
          }

          if (!data || !data.path) {
            console.error("[API Upload] No path returned from upload");
            return resolve(NextResponse.json(
              { success: false, error: "Upload failed" },
              { status: 500 }
            ));
          }

          const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/car-images/${data.path}`;
          
          console.log(`[API Upload] Success: ${newFileName}`);
          resolve(NextResponse.json({ 
            success: true, 
            url: fileUrl, 
            filePath: data.path 
          }));
        } catch (error) {
          console.error("[API Upload] Upload processing error:", error.message);
          reject(error);
        }
      });

      // Pipe request body to busboy
      if (request.body) {
        request.body.pipeTo(
          new WritableStream({
            write(chunk) {
              bb.write(chunk);
            },
            close() {
              bb.end();
            },
            abort(err) {
              console.error("[API Upload] Request aborted:", err?.message);
              bb.destroy();
            },
          })
        ).catch((err) => {
          console.error("[API Upload] Pipe error:", err.message);
          reject(err);
        });
      }
    });
  } catch (error) {
    console.error("[API Upload] Exception:", error.message);
    return NextResponse.json(
      { success: false, error: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}
