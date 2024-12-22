import { LoaderFunction, redirect } from '@remix-run/cloudflare';
import { createUserSession } from '~/services/auth.server';
import type { UserSession } from '~/services/auth.server';
import { getBaseUrl } from '~/utils/env.server';
import { getGoogleTokens, getGoogleUserInfo } from '~/utils/google.server';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const baseUrl = getBaseUrl(request);
  const redirectUri = `${baseUrl}/auth/google/callback`;

  if (!code) {
    return redirect('/login');
  }

  try {
    // Get tokens from Google
    const tokens = await getGoogleTokens(code, redirectUri);

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
