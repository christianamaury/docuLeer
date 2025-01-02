import {handleAuth} from "@kinde-oss/kinde-auth-nextjs/server";

//In order to be able to use it on the request parameters;
//Returning a response Object;
import {NextRequest, NextResponse} from "next/server";

export async function GET (request: NextRequest, {params}: any ) {
const endpoint = params.kindeAuth;

//Ensuring 'handleAuhth' correctly returns a Response; 
const response = await handleAuth(request, endpoint);

return NextResponse.json(response);

// return handleAuth(request, endpoint);

}

