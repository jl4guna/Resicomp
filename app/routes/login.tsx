import type { LoaderFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { getUserSession } from '~/services/auth.server';
import type { UserSession } from '~/services/auth.server';
import { getBaseUrl } from '~/utils/env.server';

type LoaderData = {
  user: UserSession | null;
  googleAuthUrl: string;
};

export const loader: LoaderFunction = async ({ request, context }) => {
  const user = await getUserSession(request);
  const baseUrl = getBaseUrl(request, context.env);

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
    context.env.GOOGLE_CLIENT_ID
  }&redirect_uri=${encodeURIComponent(
    `${baseUrl}/auth/google/callback`
  )}&response_type=code&scope=email profile`;

  return { user, googleAuthUrl } as LoaderData;
};

export default function Login() {
  const { user, googleAuthUrl } = useLoaderData<LoaderData>();

  if (user) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-8'>
          <div className='flex flex-col items-center'>
            <img
              src={user.picture}
              alt={user.name}
              className='h-24 w-24 rounded-full'
            />
            <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
              Bienvenido, {user.name}
            </h2>
            <p className='mt-2 text-center text-sm text-gray-600'>
              {user.email}
            </p>
            <form action='/logout' method='post' className='mt-4'>
              <button
                type='submit'
                className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'>
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Inicia sesión en tu cuenta
          </h2>
        </div>
        <div className='mt-8 space-y-6'>
          <div>
            <a
              href={googleAuthUrl}
              className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>
              <svg
                className='w-5 h-5 mr-2'
                fill='currentColor'
                viewBox='0 0 24 24'
                aria-hidden='true'>
                <path d='M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z' />
              </svg>
              Continuar con Google
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
