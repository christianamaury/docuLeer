import {handleAuth} from "@kinde-oss/kinde-auth-nextjs/server";

//In order to be able to use it on the request parameters;
import {NextRequest} from "next/server";

export async function GET (request: NextRequest, {params}: any ){
const endpoint = params.kindeAuth;
return handleAuth(request, endpoint);

}

