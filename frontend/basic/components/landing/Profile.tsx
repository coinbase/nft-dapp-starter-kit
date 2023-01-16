import { Button } from '@chakra-ui/react';
import { SignInButton } from '@components/web3/SignInButton';
import React from 'react';
import { useAccount } from 'wagmi';
import styles from '@styles/Mint.module.css';

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

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <main className={styles.main}>
          {accountData ? (
            <>
              <h1 className={styles.title}>
                {state.address ? `Welcome to the community!` : `Sign in!`}
              </h1>
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
            </>
          ) : (
            <div style={{ color: 'white' }}>Connect your wallet first!</div>
          )}
        </main>
      </div>
    </div>
  );
}
