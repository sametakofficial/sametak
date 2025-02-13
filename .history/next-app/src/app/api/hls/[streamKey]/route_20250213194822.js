// app/api/streamApi/route.js

import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(req) {
  // Stream key'i URL parametresinden alıyoruz
  const { searchParams } = new URL(req.url);
  const streamKey = searchParams.get('streamKey');

  if (!streamKey) {
    return NextResponse.json({ error: 'Stream key is required' }, { status: 400 });
  }

  // Stream key'e bağlı olarak m3u8 dosyasının yolunu belirliyoruz
  const filePath = path.join(process.cwd(), 'tmp', 'hls', `${streamKey}.m3u8`);
  
  // Dosyanın var olup olmadığını kontrol ediyoruz
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Stream file not found' }, { status: 404 });
  }

  // Dosyayı okuma işlemi
  const stream = fs.createReadStream(filePath);

  // Dosyayı HTTP yanıtı olarak gönderiyoruz
  return new NextResponse(stream, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.apple.mpegurl',
    },
  });
}
