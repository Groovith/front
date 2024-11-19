import { useNavigate } from "react-router-dom";
import H1 from "../../components/common/H1";
import { Button } from "../../components/common/Button";
import { ChevronLeft } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full">
        <Button
          variant={"ghost"}
          onClick={() => {
            navigate(-1);
          }}
        >
          <ChevronLeft />
        </Button>
      </div>
      <div className="flex h-full w-full flex-col items-start justify-center gap-4 p-6">
        <H1>🤷‍♂️404 NOT FOUND!</H1>
        <p className="w-full text-neutral-400">
          404 Not Found 페이지입니다. 뭔가 좀 더 예쁘게 꾸미면 좋을 것 같은데...
          시간이 되면 해보겠습니다.
        </p>
      </div>
    </div>
  );
}
