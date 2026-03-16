import { Outlet } from "react-router-dom";

export function AdminLayout() {
    return (
        <div className="min-h-screen bg-[#FDFDFE]">
            {/* later you can add admin sidebar here */}
            <Outlet />
        </div>
    );
}