interface CurrentTrackInfoProps {
    imgUrl: string;
    trackName: string;
    artistName: string;
}

export default function CurrentTrackInfo({imgUrl, trackName, artistName} : CurrentTrackInfoProps) {
  return (
    <div className="flex items-center">
      <img
        src={imgUrl}
        className="mr-3 size-12 rounded-md object-contain"
      />
      <div className="flex flex-col">
        <p className="text-neutral-900">
          {trackName}
        </p>
        <p className="text-neutral-500">
          {artistName}
        </p>
      </div>
    </div>
  );
}
