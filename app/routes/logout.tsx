import { ActionFunction, redirect } from '@remix-run/cloudflare';
import { logout } from '~/services/auth.server';

export const action: ActionFunction = async ({ request }) => {
  return logout(request);
};

export const loader = () => redirect('/');
