import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { createUserSession } from '~/services/auth.server';
import type { UserSession } from '~/services/auth.server';
import { getBaseUrl } from '~/utils/env.server';
import { getGoogleTokens, getGoogleUserInfo } from '~/utils/google.server';

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const baseUrl = getBaseUrl(request, context.env);
  const redirectUri = `${baseUrl}/auth/google/callback`;

  if (!code) {
    return redirect('/login');
  }

  try {
    // Get tokens from Google
    const tokens = await getGoogleTokens(code, redirectUri, context.env);

    // Get user info using the access token
    const userInfo = await getGoogleUserInfo(tokens.access_token);

    const user: UserSession = {
      id: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
    };

    // Create a session for the user
    return createUserSession(user, '/');
  } catch (error) {
    console.error('Authentication error:', error);
    return redirect('/login');
  }
};
