import * as React from 'react';
import { useAccount, useNetwork, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';
import { Button } from '@chakra-ui/react';

export function SignInButton({
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
