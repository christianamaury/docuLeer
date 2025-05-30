"use client"

//Ensure it's only rendered at a runtime interval;
export const dynamic = "force-dynamic";

//router navigation; 
import { Suspense, useEffect } from 'react'; 
import { useRouter, useSearchParams } from 'next/navigation';
import { trpc } from '../_trpc/client';
import { Loader2 } from 'lucide-react';
import { TRPCClientErrorLike } from '@trpc/client';
import { AppRouter } from '@/trpc'; // Assuming AppRouter is your root tRPC router type

const AuthCallbackContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const origin = searchParams.get('origin');

    const { data, error, isLoading } = trpc.authCallback.useQuery(undefined, {
        retry: true,
        retryDelay: 500,
    });

    useEffect(() => {
        if (isLoading) {
            // UI already handles loading state with the spinner
            return;
        }

        if (error) {
            console.error("Auth Callback tRPC Error:", error);
            const trpcError = error as TRPCClientErrorLike<AppRouter>; // Type assertion
            if (trpcError.data?.code === "UNAUTHORIZED") {
                router.push('/sign-in');
            } else {
                // For "State not found" or other errors, redirect to sign-in with an error indicator
                router.push('/sign-in?error=auth_failed');
            }
            return;
        }

        if (data) {
            if (data.success) {
                router.push(origin ? `/${origin}` : '/dashboard');
            } else {
                // Handle case where API returns success: false but no explicit error
                console.warn("Auth callback returned success: false without explicit error.");
                router.push('/sign-in?error=auth_failed');
            }
        }
    }, [data, error, isLoading, origin, router]);

    return (
        <div className='w-full mt-24 flex justify-center'>
            <div className='flex flex-col items-center gap-2'>
                <Loader2 className='h-8 w-8 animate-spin text-zinc-800' />
                <h3 className='font-semibold text-xl'>
                    Setting up your account...
                </h3>
                <p>You will be redirected automatically.</p>
            </div>
        </div>
    );
};

const Page = () => {
  return (
    <Suspense fallback={
        <div className='w-full mt-24 flex justify-center'>
            <div className='flex flex-col items-center gap-2'>
                <Loader2 className='h-8 w-8 animate-spin text-zinc-800' />
                <h3 className='font-semibold text-xl'>Loading...</h3>
            </div>
        </div>
    }> 
      <AuthCallbackContent />
    </Suspense>
  )
}

export default Page;