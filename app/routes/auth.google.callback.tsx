import { LoaderFunction, redirect } from '@remix-run/cloudflare';
import { OAuth2Client } from 'google-auth-library';
import { createUserSession } from '~/services/auth.server';
import type { UserSession } from '~/services/auth.server';
import { getBaseUrl } from '~/utils/env.server';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const baseUrl = getBaseUrl(request);

  if (!code) {
    return redirect('/login');
  }

  try {
    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${baseUrl}/auth/google/callback`
    );

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('No user payload');
    }

    const user: UserSession = {
      id: payload.sub,
      email: payload.email || '',
      name: payload.name || '',
      picture: payload.picture || '',
    };

    // Create a session for the user
    return createUserSession(user, '/');
  } catch (error) {
    console.error('Authentication error:', error);
    return redirect('/login');
  }
};
