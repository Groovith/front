import { ChevronLeft } from "lucide-react";
import { Button } from "../common/Button";
import { useNavigate } from "react-router-dom";
import H2 from "../common/H2";

interface SettingDetailsHeaderProps {
  title: string;
}

export default function SettingDetailsHeader({
  title,
}: SettingDetailsHeaderProps) {
  const navigate = useNavigate();
  return (
    <div className="flex w-full items-center justify-start gap-2">
      <Button variant={"ghost"} className="p-1" onClick={() => navigate(-1)}>
        <ChevronLeft />
      </Button>
      <H2>{title}</H2>
    </div>
  );
}
