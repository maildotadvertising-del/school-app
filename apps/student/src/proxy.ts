import { NextResponse, type NextRequest } from "next/server";
import { decryptSession } from "@ats/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/login") || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("ats_student_session")?.value;
  const session = await decryptSession(token);

  if (!session || session.role !== "STUDENT") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
