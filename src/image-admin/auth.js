const managerBase = new URL('./', import.meta.url);
let signingIn;

async function sessionRequest(options = {}) {
  const response = await fetch(new URL('session', managerBase), {
    credentials: 'same-origin',
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || data.error || 'GitHub sign-in could not be completed.');
    error.status = response.status;
    throw error;
  }
  if (!data.authenticated || typeof data.login !== 'string')
    throw new Error('The sign-in response was incomplete. Please try again.');
  return data;
}

export const sessionInfo = () => sessionRequest();

export function signIn({ remember = false, onStatus = () => {} } = {}) {
  if (signingIn) return signingIn;
  const flow = new Promise((resolve, reject) => {
    const origin = location.origin;
    let popup;
    let processing = false;
    let closedTimer;
    let timeout;
    const cleanup = () => {
      window.removeEventListener('message', receive);
      clearInterval(closedTimer);
      clearTimeout(timeout);
      popup?.close();
    };
    const fail = (error) => {
      cleanup();
      reject(error);
    };
    async function receive(event) {
      if (
        processing ||
        event.origin !== origin ||
        event.source !== popup ||
        typeof event.data !== 'string'
      )
        return;
      if (event.data === 'authorizing:github') {
        popup.postMessage('authorizing:github', origin);
        return;
      }
      const match = event.data.match(/^authorization:github:(success|error):(.+)$/s);
      if (!match) return;
      processing = true;
      cleanup();
      try {
        const data = JSON.parse(match[2]);
        if (data?.provider !== 'github')
          throw new Error('GitHub returned an invalid sign-in response.');
        if (match[1] === 'error')
          throw new Error(
            typeof data.error === 'string' ? data.error : 'GitHub sign-in was not completed.',
          );
        if (typeof data.token !== 'string' || !data.token || data.token.length > 4096)
          throw new Error('GitHub did not return a valid sign-in token.');
        onStatus('Checking your repository access…');
        resolve(
          await sessionRequest({
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ token: data.token, remember: Boolean(remember) }),
          }),
        );
      } catch (error) {
        reject(
          error instanceof SyntaxError
            ? new Error('GitHub returned an invalid sign-in response.')
            : error,
        );
      }
    }
    window.addEventListener('message', receive);
    popup = window.open(
      new URL('/oauth/auth?provider=github&site_id=panel-assistant.io', origin).href,
      `panel-image-sign-in-${crypto.randomUUID()}`,
      'popup,width=560,height=720',
    );
    if (!popup) {
      fail(
        new Error(
          'Your browser blocked the GitHub sign-in window. Allow popups for this site and try again.',
        ),
      );
      return;
    }
    onStatus('Complete sign-in in the GitHub window.');
    popup.focus();
    closedTimer = setInterval(() => {
      if (popup.closed) fail(new Error('The GitHub sign-in window was closed. Please try again.'));
    }, 500);
    timeout = setTimeout(
      () => fail(new Error('GitHub sign-in timed out. Please try again.')),
      5 * 60 * 1000,
    );
  });
  signingIn = flow.finally(() => {
    signingIn = undefined;
  });
  return signingIn;
}

const login = document.getElementById('github-sign-in');
if (login) {
  const remember = document.getElementById('remember');
  const status = document.getElementById('status');
  login.addEventListener('click', async () => {
    login.disabled = true;
    remember.disabled = true;
    try {
      await signIn({ remember: remember.checked, onStatus: (text) => (status.textContent = text) });
      location.replace(managerBase.href);
    } catch (error) {
      status.textContent = error.message;
      login.disabled = false;
      remember.disabled = false;
    }
  });
}
