import { NextRequest, NextResponse } from "next/server";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { promisify } from "util";

const uploadDir = path.join(process.cwd(), "uploads");

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const multerUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  fileFilter: (
    _req: any,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|txt)$/)) {
      return cb(new Error("Only image, PDF, or text files are allowed!"));
    }
    cb(null, true);
  },
});

// Promisify Multer
const uploadMiddleware = promisify(multerUpload.single("file"));

// POST Handler
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof Blob)) {
      return NextResponse.json(
        { error: "Invalid file upload" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, `${Date.now()}-${file.name}`);
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({
      message: "File uploaded successfully",
      file: {
        filename: file.name,
        path: filePath,
      },
    });
  } catch (error: any) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { error: `Something went wrong! ${error.message}` },
      { status: 500 },
    );
  }
}

export const config = {
  api: {
    bodyParser: false, // Disables default body parsing
  },
};
