import HLSPlayer from "../components/VideoPlayer";

export default function Home() {
  return (
    <div>
      <h1>Welcome to Live Stream!</h1>
      <HLSPlayer streamKey="test" />{" "}
    </div>
  );
}
