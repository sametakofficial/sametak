"use client";
import { useEffect, useRef } from 'react';
import Hls from "hls.js";

const HLSPlayer = ({ streamKey }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls();
      // Dinamik olarak API'den streamKey ile m3u8 dosyasını al
      hls.loadSource(`/api/hls/${streamKey}`);
      hls.attachMedia(videoElement);

      return () => {
        hls.destroy();
      };
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS desteği olan tarayıcılarda çalışacak
      videoElement.src = `/api/hls/${streamKey}`;
    }
  }, [streamKey]);

  return (
    <video ref={videoRef} controls autoPlay>
      Your browser does not support the video tag.
    </video>
  );
};

export default HLSPlayer;
