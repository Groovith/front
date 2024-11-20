import { Outlet } from "react-router-dom";

export default function SettingDetailsPage() {
  return (
    <div className="flex size-full justify-center px-8 py-8">
      <div className="flex flex-col max-w-screen-md size-full">
        <Outlet />
      </div>
    </div>
  );
}
