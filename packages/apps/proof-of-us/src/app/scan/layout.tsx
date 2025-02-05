'use client';
import { ProofOfUsProvider } from '@/components/ProofOfUsProvider/ProofOfUsProvider';
import { useAccount } from '@/hooks/account';
import type { FC, PropsWithChildren } from 'react';

const ScanLayout: FC<PropsWithChildren> = ({ children }) => {
  const { account, isMounted, login } = useAccount();

  if (!isMounted) return null;
  return (
    <ProofOfUsProvider>
      <section>
        {!account && isMounted ? (
          <section>
            <p>
              scan. we need to check if the user is logged in. if not explain
              that they need to login. before continuing, scanning and signing
            </p>
            <p>
              You need to be logged in to scan and claim your Proof Of Us
              <button onClick={login}>login</button>
            </p>
          </section>
        ) : (
          <section>{children}</section>
        )}
      </section>
    </ProofOfUsProvider>
  );
};

export default ScanLayout;
