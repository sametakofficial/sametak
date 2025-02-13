"use client";
import { useEffect, useRef } from 'react';
import Hls from "hls.js";

const HLSPlayer = ({ streamKey }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    const backendUrl = `http://backend:5000/api/media/hls/${streamKey}`;  // Backend'e doğrudan istek

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(backendUrl);  // Express backend'inden m3u8 dosyasını alıyoruz
      hls.attachMedia(videoElement);

      return () => {
        hls.destroy();
      };
    } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
      videoElement.src = backendUrl;  // Native HLS desteği
    }
  }, [streamKey]);

  return (
    <video ref={videoRef} controls autoPlay>
      Your browser does not support the video tag.
    </video>
  );
};

export default HLSPlayer;
