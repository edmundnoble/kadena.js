/*
  TO-DO:

  needed for fundCommand.ts and probably others
  probaby merge with other config
 */
import { createClient } from '@kadena/client';
import type { ChainId } from '@kadena/types';

// you can edit this function if you want to use different network like dev-net or a private net
export const apiHostGenerator = ({
  networkId,
  chainId,
}: {
  networkId: string;
  chainId: ChainId;
}): string => {
  switch (networkId) {
    case 'mainnet01':
      return `https://api.chainweb.com/chainweb/0.0/${networkId}/chain/${
        chainId ?? '1'
      }/pact`;
    case 'fast-development':
      return `http://localhost:8080/chainweb/0.0/${networkId}/chain/${
        chainId ?? '1'
      }/pact`;
    case 'testnet04':
    default:
      return `https://api.testnet.chainweb.com/chainweb/0.0/${networkId}/chain/${
        chainId ?? '1'
      }/pact`;
  }
};

// configure the client and export the functions
export const {
  submit,
  //   preflight,
  dirtyRead,
  pollCreateSpv,
  pollStatus,
  getStatus,
  createSpv,
} = createClient();

export const networkChoices: { value: string; name: string }[] = [
  { value: 'mainnet', name: 'Mainnet' },
  { value: 'testnet', name: 'Testnet' },
  { value: 'devnet', name: 'Devnet' },
];

/**
 * Calling client.send can print errors to console.
 * Wrap in this method to suppress errors.
 *
 * example usage:
 * ```
 * const response = await clientSendWrapper(() => client.submit(command));
 * ```
 */
export const clientSendWrapper = async <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends (...args: any[]) => any,
>(
  fn: T,
): Promise<Awaited<ReturnType<T>>> => {
  return new Promise<Awaited<ReturnType<T>>>((resolve, reject) => {
    const stderrWrite = process.stderr.write;
    // @ts-ignore
    process.stderr.write = () => {};
    // Not using `.finally()` to restore stderr before executing resolve/reject
    Promise.resolve(fn())
      .then((value) => {
        process.stderr.write = stderrWrite;
        resolve(value);
      })
      .catch((error) => {
        process.stderr.write = stderrWrite;
        reject(error);
      });
  });
};
