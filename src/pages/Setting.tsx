import { Button } from "../components/common/Button";
import { ChevronRight } from "lucide-react";

export default function Setting() {

  return (
    <div className="flex h-full w-full justify-center px-10 py-16">
      <div className="flex h-full w-full max-w-screen-md flex-col gap-16">
        <h1 className="text-2xl font-bold">설정</h1>
        <div>
          <h2 className="mb-5 text-xl font-bold">계정</h2>
          <Button variant={"ghost"} className="flex w-full justify-between p-4">
            <span>비밀번호 변경</span>
            <ChevronRight />
          </Button>
          <Button variant={"ghost"} className="flex w-full justify-between p-4">
            <span>회원 탈퇴</span>
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
