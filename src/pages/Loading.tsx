import logoImage from "../assets/Logo-Full.png";

export default function Loading() {
  return (
    <div className="flex w-screen h-screen items-center justify-center text-neutral-400">
      <div>
        <img src={logoImage} alt="Loading..." className="size-16" />
      </div>
    </div>
  );
}
