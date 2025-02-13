"use client";
import { useEffect, useRef } from 'react';

const HLSPlayer = ({ streamKey }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls();
      // API'den streamKey parametresiyle dosyayı yükle
      hls.loadSource(`http://localhost:3000/api/streamApi?streamKey=${streamKey}`);
      hls.attachMedia(videoElement);

      return () => {
        hls.destroy();
      };
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS oynatma için destekliyorsa
      videoElement.src = `http://localhost:3000/api/streamApi?streamKey=${streamKey}`;
    }
  }, [streamKey]);

  return (
    <video ref={videoRef} controls autoPlay>
      Your browser does not support the video tag.
    </video>
  );
};

export default HLSPlayer;
