import HLSPlayer from "../components/HLSPlayer";

export default function Home() {
  return (
    <div>
      <h1>Welcome to Live Stream!</h1>
      <HLSPlayer src="/hls/test.m3u8" />{" "}
    </div>
  );
}
