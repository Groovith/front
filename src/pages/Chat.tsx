import { Plus, SearchIcon } from "lucide-react";
import { Button } from "../components/Button";

export default function Chat() {
  return (
    <div className="flex h-full w-full">
      <div className="flex h-full w-[300px] flex-col border-r bg-neutral-50 px-4 py-10">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-xl font-bold">채팅</h1>
          <div className="flex">
            <Button variant={"ghost"}>
              <SearchIcon />
            </Button>
            <Button variant={"ghost"}>
              <Plus />
            </Button>
          </div>
        </div>
        <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
          아직 참여한 채팅이 없어요
        </div>
      </div>
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h1 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-neutral-900">
          내 채팅
        </h1>
        <p className="mb-6 text-center text-neutral-500">
          새로운 채팅을 만들고 친구를 초대해 음악을 같이 들어보세요.
        </p>
        <Button>채팅 만들기</Button>
      </div>
    </div>
  );
}
