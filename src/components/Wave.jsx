export default function Wave({ playing = true, size = 14 }) {
  return (
    <span className={`veyra-wave${playing ? "" : " paused"}`} style={{ height: size }}>
      <i></i><i></i><i></i><i></i>
    </span>
  );
}
