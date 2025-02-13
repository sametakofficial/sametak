import VideoPlayer from "../components/VideoPlayer";

export default function Home() {
  return (
    <div>
      <h1>Welcome to Live Stream!</h1>
      <VideoPlayer src="https://hls.sametak.com/hls/test.m3u8" />{" "}
    </div>
  );
}
