interface CurrentTrackInfoProps {
  imgUrl: string;
  trackName: string;
  artistName: string;
}

export default function CurrentTrackInfo({
  imgUrl,
  trackName,
  artistName,
}: CurrentTrackInfoProps) {
  return (
    <div className="flex items-center truncate">
      <img src={imgUrl} className="mr-3 size-12 rounded-md object-cover" />
      <div className="flex flex-col truncate">
        <p className="w-fit truncate text-neutral-900">
          {trackName}
        </p>
        <p className="w-fit truncate text-neutral-500">{artistName}</p>
      </div>
    </div>
  );
}
