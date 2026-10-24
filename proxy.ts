import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    if (!request.cookies.has("access_token")) {
        const login = new URL("/login", request.url);
        login.searchParams.set("next", request.nextUrl.pathname);
        return NextResponse.redirect(login);
    }
    return NextResponse.next();
}

export default proxy;

export const config = {
    matcher: ["/profile/:path*", "/workspace", "/workspace/:path*"],
};
