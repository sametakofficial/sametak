"use client";
import { useEffect, useRef } from "react";
import Hls from "hls.js";

const HLSPlayer = ({ streamKey }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    const hlsUrl = `/media/hls/${streamKey}/index.m3u8`; // Nginx yönlendirmesine uygun hale getirildi

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(hlsUrl);
      hls.attachMedia(videoElement);

      return () => {
        hls.destroy();
      };
    } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
      videoElement.src = hlsUrl;
    }
  }, [streamKey]);

  return (
    <video ref={videoRef} controls autoPlay>
      Your browser does not support the video tag.
    </video>
  );
};

export default HLSPlayer;
