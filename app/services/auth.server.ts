import {
  createCookieSessionStorage,
  redirect,
} from '@remix-run/server-runtime';

export type UserSession = {
  id: string;
  email: string;
  name: string;
  picture: string;
};

// Session storage configuration
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_session',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: ['default-secret'],
    secure: true,
  },
});

export async function createUserSession(user: UserSession, redirectTo: string) {
  const session = await sessionStorage.getSession();
  session.set('user', user);
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session),
    },
  });
}

export async function getUserSession(
  request: Request
): Promise<UserSession | null> {
  const session = await sessionStorage.getSession(
    request.headers.get('Cookie')
  );
  return session.get('user');
}

export async function requireUser(request: Request): Promise<UserSession> {
  const user = await getUserSession(request);
  if (!user) {
    throw redirect('/login');
  }
  return user;
}

export async function logout(request: Request) {
  const session = await sessionStorage.getSession(
    request.headers.get('Cookie')
  );
  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  });
}
