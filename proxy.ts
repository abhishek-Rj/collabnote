import { NextRequest, NextResponse } from "next/server";

export default async function proxy(req: NextRequest) {
    const accessToken = req.cookies.get("access_token")?.value;
    const refreshToken = req.cookies.get("refresh_token")?.value;

    if (accessToken) {
        return NextResponse.next();
    }

    if (refreshToken) {
        const refresh_url = `${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}/auth/refresh`;
        const response = await fetch(refresh_url, {
            method: "POST",
            credentials: "include",
            headers: {
                Cookie: `refresh_token=${refreshToken}`,
            },
        });

        if (response.ok) {
            return NextResponse.next();
        }
    }
    return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
    matcher: ["/profile/:path*", "/workspace", "/workspace/:path*"],
};
