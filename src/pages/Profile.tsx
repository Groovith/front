import { EllipsisVertical } from "lucide-react";
import defaultUserImage from "../assets/default-user-image.png";
import { Button } from "../components/Button";

export default function Profile() {
  return (
    <div className="flex h-full w-full justify-center px-10 text-neutral-900">
      <div className="flex w-full max-w-screen-md flex-col gap-10 py-20">
        <div className="flex items-center gap-6">
          <img
            src={defaultUserImage}
            className="size-28 rounded-full hover:cursor-pointer"
          />
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-neutral-900">이름</h1>
            <p className="text-xl text-neutral-600">@username</p>
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-5">
          <Button className="w-full">팔로우</Button>
          <Button className="w-full border border-neutral-600 bg-white text-neutral-900 hover:bg-neutral-200">
            채팅 시작
          </Button>
          <Button variant={"ghost"}>
            <EllipsisVertical />
          </Button>
        </div>
      </div>
    </div>
  );
}
