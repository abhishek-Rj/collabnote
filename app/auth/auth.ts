import { cookies } from "next/headers";

export default async function getServerSession() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

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

    return fetchUser.json();
}
