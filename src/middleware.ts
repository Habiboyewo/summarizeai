import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserMeLoader } from "./data/services/get-user-me-loader";

export async function middleware(request: NextRequest) {
  const jwt = request.cookies.get("jwt")?.value;
  const currentPath = request.nextUrl.pathname;

  console.log("##### MIDDLEWARE #####");
  console.log("JWT:", jwt ? "present" : "missing");
  console.log("Path:", currentPath);

  // Try loading user if JWT exists
  let user = null;
  let fetchError = null;
  if (jwt) {
    const userRes = await getUserMeLoader(jwt);
    if (userRes.ok) {
      user = userRes.data;
    } else {
      fetchError = userRes.error; // Could be Strapi error object or fetch exception
    }
  }

  console.log("USER:", user ? `loaded (ID: ${user.id})` : "fetch failed");
  if (fetchError) {
    console.log("FETCH ERROR:", fetchError); // This will reveal the 403 or other details
  }
  console.log("##### MIDDLEWARE #####");

  if (currentPath.startsWith("/dashboard") && !jwt) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export async function middleware(request: NextRequest) {
//   const jwt = request.cookies.get("jwt")?.value;
//   const currentPath = request.nextUrl.pathname;

//   console.log("##### MIDDLEWARE #####");
//   console.log("JWT:", jwt);
//   console.log(currentPath);
//   console.log("##### MIDDLEWARE #####");

//   if (currentPath.startsWith("/dashboard") && !jwt) {
//     return NextResponse.redirect(new URL("/signin", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*"],
// };
