import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../../mocks/server.js';
import { transferFund } from '../transferFund.js';
import { devNetConfigMock } from './mocks.js';

describe('transferFund', () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it('should throw an error when trying to transfer fund on mainnet', async () => {
    await expect(async () => {
      await transferFund({
        accountName: 'accountName',
        config: {
          amount: '100',
          contract: 'coin',
          chainId: '1',
          networkConfig: {
            ...devNetConfigMock,
            networkId: 'mainnet01',
          },
        },
      });
    }).rejects.toEqual(
      Error('Failed to transfer fund : "Cannot transfer fund on mainnet"'),
    );
  });

  it('should fund an account', async () => {
    const result = await transferFund({
      accountName: 'accountName',
      config: {
        amount: '100',
        contract: 'coin',
        chainId: '1',
        networkConfig: devNetConfigMock,
      },
    });
    expect(result).toStrictEqual({
      result: {
        reqKey: 'requestKey-1',
        result: {
          status: 'success',
          data: 'Write succeeded',
        },
      },
    });
  });

  it('should throw an error when any sort of error happens', async () => {
    server.use(
      http.post(
        'https://localhost:8080/chainweb/0.0/fast-development/chain/1/pact/api/v1/send',
        () => {
          return new HttpResponse('Something went wrong', { status: 500 });
        },
      ),
    );

    await expect(async () => {
      await transferFund({
        accountName: 'accountName',
        config: {
          amount: '100',
          contract: 'coin',
          chainId: '1',
          networkConfig: devNetConfigMock,
        },
      });
    }).rejects.toEqual(
      Error('Failed to transfer fund : "Something went wrong"'),
    );
  });
});
