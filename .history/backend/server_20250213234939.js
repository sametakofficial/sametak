// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3004; // İstediğiniz portu seçebilirsiniz

// HLS klasörünün yolu
const hlsDirectory = path.join(__dirname, 'hls');

// HLS dosyalarını sunacak bir API
app.get('/media/hls/:streamKey', (req, res) => {
  const { streamKey } = req.params;
  const { segment } = req.query;

  // Eğer segment var ise ts dosyasını döndürüyoruz
  if (segment) {
    const tsFilePath = path.join(hlsDirectory, `${streamKey}_segment${segment}.ts`);
    
    // Dosyanın mevcut olup olmadığını kontrol et
    if (!fs.existsSync(tsFilePath)) {
      return res.status(404).json({ error: 'Segment file not found' });
    }

    const tsStream = fs.createReadStream(tsFilePath);
    return tsStream.pipe(res).on('error', (err) => {
      console.error(err);
      res.status(500).json({ error: 'Error streaming the file' });
    });
  }

  // Eğer segment yoksa, m3u8 dosyasını sunuyoruz
  const m3u8FilePath = path.join(hlsDirectory, `${streamKey}.m3u8`);

  // Dosyanın mevcut olup olmadığını kontrol et
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
  console.log(`Server is running at http://localhost:${port}`);
});
