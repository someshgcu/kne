import { Outlet } from "react-router-dom";
import { Header } from "../app/components/Header";
import { Footer } from "../app/components/Footer";
import { Chatbot } from "../app/components/Chatbot";

export function PublicLayout() {
    return (
        <>
            <Header />

            <main className="flex-grow">
                <Outlet />
            </main>

            <Chatbot />
            <Footer />
        </>
    );
}