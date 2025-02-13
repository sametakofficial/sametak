"use client";
import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [hlsInstance, setHlsInstance] = useState(null);
  const [qualityLevels, setQualityLevels] = useState([]);
  const [selectedQuality, setSelectedQuality] = useState("auto");

  // HLS kaynağını public klasöründe belirtiyoruz
  const src = "/hls/liveStream.m3u8";  // HLS dosyasının yolu

  useEffect(() => {
    if (!videoRef.current) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const levels = hls.levels.map((level, index) => ({
          index,
          resolution: level.height + "p",
          bandwidth: (level.bitrate / 1000).toFixed(0) + " kbps",
        }));
        setQualityLevels(levels);
      });

      setHlsInstance(hls);
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = src;
    }

    return () => {
      if (hlsInstance) hlsInstance.destroy();
    };
  }, [src]);

  const handleQualityChange = (levelIndex) => {
    setSelectedQuality(levelIndex);
    if (hlsInstance) {
      if (levelIndex === "auto") {
        hlsInstance.currentLevel = -1;
      } else {
        hlsInstance.currentLevel = levelIndex;
      }
    }
  };

  return (
    <div>
      <img src="/kadin.jpg" className="h-"><img/>
      <video
        ref={videoRef}
        controls
        autoPlay
        muted
        style={{ width: "100%", maxWidth: "800px" }}
      />
      <div style={{ marginTop: "10px" }}>
        <label>Kalite Seç:</label>
        <select
          value={selectedQuality}
          onChange={(e) =>
            handleQualityChange(
              e.target.value === "auto" ? "auto" : Number(e.target.value)
            )
          }
        >
          <option value="auto">Otomatik</option>
          {qualityLevels.map((level) => (
            <option key={level.index} value={level.index}>
              {level.resolution} ({level.bandwidth})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default VideoPlayer;
