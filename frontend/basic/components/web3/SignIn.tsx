import * as React from 'react';
import { useAccount, useNetwork, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';
import styles from '@styles/Mint.module.css';
import { Button } from '@chakra-ui/react';

function SignInButton({
  onSuccess,
  onError,
}: {
  onSuccess: (args: { address: string }) => void;
  onError: (args: { error: Error }) => void;
}) {
  const [state, setState] = React.useState<{
    loading?: boolean;
    nonce?: string;
  }>({});

  const fetchNonce = async () => {
    try {
      const nonceRes = await fetch('/api/nonce');
      const nonce = await nonceRes.text();
      setState((x) => ({ ...x, nonce }));
    } catch (error) {
      setState((x) => ({ ...x, error: error as Error }));
    }
  };

  // Pre-fetch random nonce when button is rendered
  // to ensure deep linking works for WalletConnect
  // users on iOS when signing the SIWE message
  React.useEffect(() => {
    fetchNonce();
  }, []);

  const { data: accountData } = useAccount();
  const { activeChain } = useNetwork();
  const { signMessageAsync } = useSignMessage();

  const signIn = async () => {
    try {
      const chainId = activeChain?.id;
      const address = accountData?.address;
      if (!address || !chainId) return;

      setState((x) => ({ ...x, loading: true }));
      // Create SIWE message with pre-fetched nonce and sign with wallet
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce: state.nonce,
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      // Verify signature
      const verifyRes = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, signature }),
      });
      if (!verifyRes.ok) throw new Error('Error verifying message');

      setState((x) => ({ ...x, loading: false }));
      onSuccess({ address });
    } catch (error) {
      setState((x) => ({ ...x, loading: false, nonce: undefined }));
      onError({ error: error as Error });
      fetchNonce();
    }
  };

  return (
    <Button
      style={{
        color: '#4b4f56',
        borderRadius: '0',
      }}
      disabled={!state.nonce || state.loading}
      onClick={signIn}
    >
      Sign-In with Ethereum
    </Button>
  );
}

export function Profile() {
  const { data: accountData } = useAccount();

  const [state, setState] = React.useState<{
    address?: string;
    error?: Error;
    loading?: boolean;
  }>({});

  // Fetch user when:
  React.useEffect(() => {
    const handler = async () => {
      try {
        console.debug('hi');
        const res = await fetch('/api/me');
        const json = await res.json();
        setState((x) => ({ ...x, address: json.address }));
      } catch (_error) {
        console.error(_error);
      }
    };
    // 1. page loads
    handler();

    // 2. window is focused (in case user logs out of another window)
    window.addEventListener('focus', handler);
    return () => window.removeEventListener('focus', handler);
  }, []);

  if (accountData) {
    return (
      <div className={styles.background}>
        <div className={styles.container}>
          <main className={styles.main}>
            <h1 className={styles.title}>asdf</h1>
            <div>
              {state.address ? (
                <div>
                  <div style={{ color: 'white' }}>
                    Signed in as {state.address}
                  </div>
                  <Button
                    style={{
                      color: '#4b4f56',
                      borderRadius: '0',
                    }}
                    onClick={async () => {
                      await fetch('/api/logout');
                      setState({});
                    }}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <SignInButton
                  onSuccess={({ address }) =>
                    setState((x) => ({ ...x, address }))
                  }
                  onError={({ error }) => setState((x) => ({ ...x, error }))}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div>
      {' '}
      <p>fdsa</p>
    </div>
  );
}
