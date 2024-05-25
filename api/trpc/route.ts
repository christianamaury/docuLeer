//This would handle all the API Logic
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
// import { appRouter } from '~/server/api/router';
import {appRouter} from '@/trpc'

function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => ({ })
  });
}

export { handler as GET, handler as POST };