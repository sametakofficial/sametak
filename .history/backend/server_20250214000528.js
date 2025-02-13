const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 500;

// HLS dosyalarının bulunduğu klasör
const hlsDirectory = path.join(__dirname, 'media/hls');

// HLS dosyalarını sunacak bir API route
app.get('/api/media/hls/:streamKey', (req, res) => {
  const { streamKey } = req.params;
  const { segment } = req.query;

  if (segment) {
    // Segment (TS dosyasını) almak
    const tsFilePath = path.join(hlsDirectory, `${streamKey}_segment${segment}.ts`);
    
    if (!fs.existsSync(tsFilePath)) {
      return res.status(404).json({ error: 'Segment file not found' });
    }

    const tsStream = fs.createReadStream(tsFilePath);
    return tsStream.pipe(res).on('error', (err) => {
      console.error(err);
      res.status(500).json({ error: 'Error streaming the file' });
    });
  }

  // M3U8 dosyasını almak
  const m3u8FilePath = path.join(hlsDirectory, `${streamKey}.m3u8`);

  if (!fs.existsSync(m3u8FilePath)) {
    return res.status(404).json({ error: 'M3U8 file not found' });
  }

  const m3u8Stream = fs.createReadStream(m3u8FilePath);
  res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
  return m3u8Stream.pipe(res).on('error', (err) => {
    console.error(err);
    res.status(500).json({ error: 'Error streaming the file' });
  });
});

// Sunucuyu başlat
app.listen(port, () => {
  console.log(`Express backend is running at http://localhost:${port}`);
});
