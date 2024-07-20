export default function Player() {
  return (
    <div className="flex h-[80px] w-full">
      {/* Seek Bar */}
      <input
        className="absolute z-10 h-1 w-full cursor-pointer appearance-none bg-gray-200 accent-black disabled:accent-gray-200 outline-none"
        type="range"
        min="0"
        max="100"
        value={0}
        onChange={() => {}}
      />
    </div>
  );
}
