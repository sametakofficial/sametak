// app/api/hls/[streamKey]/route.js
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(req, { params }) {
  const { streamKey } = await params; // params'ı await etmemiz gerekiyor
  const { searchParams } = new URL(req.url);
  const segment = searchParams.get("segment"); // Dinamik segment (ts dosyası)

  if (!streamKey) {
    return NextResponse.json(
      { error: "Stream key is required" },
      { status: 400 }
    );
  }

  // Eğer segment varsa, segment (ts dosyası) sunulacak
  if (segment) {
    const tsFilePath = path.join(
      process.cwd(),
      "tmp",
      "hls",
      `${streamKey}_segment${segment}.ts`
    );

    // Dosyanın mevcut olup olmadığını kontrol et
    if (!fs.existsSync(tsFilePath)) {
      return NextResponse.json(
        { error: "Segment file not found" },
        { status: 404 }
      );
    }

    const tsStream = fs.createReadStream(tsFilePath);

    return new NextResponse(tsStream, {
      status: 200,
      headers: {
        "Content-Type": "video/MP2T", // TS dosyasının tipi
      },
    });
  }

  // Eğer segment yoksa, .m3u8 dosyasını al
  const m3u8FilePath = path.join(
    process.cwd(),
    "tmp",
    "hls",
    `${streamKey}.m3u8`
  );

  if (!fs.existsSync(m3u8FilePath)) {
    return NextResponse.json({ error: "M3U8 file not found" }, { status: 404 });
  }

  const m3u8Stream = fs.createReadStream(m3u8FilePath);

  return new NextResponse(m3u8Stream, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.apple.mpegurl", // M3U8 dosyasının tipi
    },
  });
}
