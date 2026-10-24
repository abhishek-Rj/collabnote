import { cookies } from "next/headers";
import { api } from "@/lib/api";

export default async function getServerSession() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
        return null;
    }

    try {
        const data = await api<{ user?: unknown; status?: string }>(
            "/auth/me",
            {
                method: "GET",
                headers: {
                    Cookie: `access_token=${accessToken}`,
                },
            },
        );

        if (data.status === "unauthorized" || !data.user) {
            return null;
        }

        return data.user;
    } catch (err) {
        console.error("getServerSession error:", err);
        return null;
    }
}
