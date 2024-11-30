import { useEffect, useState } from "react";
import { Button } from "../components/common/Button";
import { useNavigate } from "react-router-dom";
import { login } from "../utils/apis/serverAPI";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 토큰 유효성 확인 성공시 메인으로 리디렉트
  useEffect(() => {
    // 토큰 유효성 검사 API
  }, []);

  // 로그인 폼 제출
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await login({ email: email, password: password });
      localStorage.setItem(
        "accessToken",
        response.headers["authorization"].replace("Bearer ", ""),
      );
      navigate("/");
    } catch (e : any) {
      if (e.response.status === 401) {
        toast.error("이메일 또는 비밀번호가 맞지 않습니다.");
      }
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col">
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex w-[400px] flex-col rounded-xl  border-gray-300 p-10">
          <h1 className="mb-14 text-2xl font-bold flex-none w-full">Groovith에 로그인하기</h1>
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="mb-6 flex flex-col gap-3">
              <label htmlFor="username">이메일</label>
              <input
                id="username"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="h-8 w-full rounded-lg border px-3 py-5"
              />
            </div>
            <div className="mb-6 flex flex-col gap-3">
              <label htmlFor="password">비밀번호</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                placeholder="··········"
                onChange={(e) => setPassword(e.target.value)}
                className="h-8 w-full rounded-lg border px-3 py-5 placeholder:text-xl"
              />
            </div>
            <Button className="w-full">로그인</Button>
          </form>
          <div className="mb-14 w-full flex justify-start">
            <button className="text-sm text-neutral-600 underline" onClick={() => navigate("/reset-password")}>
              비밀번호 찾기
            </button>
          </div>
          <div className="flex items-center gap-4">
            <p>아직 계정이 없으신가요?</p>
            <Button
              variant={"ghost"}
              className="font-bold text-sky-600"
              onClick={() => navigate("/signup")}
            >
              가입하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
