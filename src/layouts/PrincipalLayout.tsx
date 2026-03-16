import { Outlet } from "react-router-dom";

export function PrincipalLayout() {
    return (
        <div className="min-h-screen bg-[#FDFDFE]">
            <Outlet />
        </div>
    );
}