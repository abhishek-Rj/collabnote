import { cookies } from "next/headers";

export default async function getServerSession() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
        return null;
    }

    try {
        const fetchUser = await fetch(
            `${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}/auth/me`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    Cookie: `access_token=${accessToken}`,
                },
            },
        );

        if (!fetchUser.ok) {
            return null;
        }

        const data = await fetchUser.json();
        if (data.status === "unauthorized" || !data.user) {
            return null;
        }

        return data.user;
    } catch (err) {
        console.error("getServerSession error:", err);
        return null;
    }
}
