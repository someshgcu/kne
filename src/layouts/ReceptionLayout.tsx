import { Outlet } from "react-router-dom";

export function ReceptionLayout() {
    return (
        <div className="min-h-screen bg-[#FDFDFE]">
            <Outlet />
        </div>
    );
}