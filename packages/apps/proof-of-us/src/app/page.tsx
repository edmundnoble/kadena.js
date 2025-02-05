'use client';
import { Button } from '@/components/Button/Button';
import { useAccount } from '@/hooks/account';
import { Stack } from '@kadena/react-ui';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useEffect } from 'react';

const Page: FC = () => {
  const { account, isMounted, login } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (!isMounted || !account) return;
    router.push('/user');
  }, [isMounted]);

  return (
    <Stack
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
      gap="xl"
    >
      <Button variant="primary" onPress={login}>
        Login
      </Button>
    </Stack>
  );
};

export default Page;
