## API Report File for "@kadena/client-utils"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import type { INetworkOptions } from '@kadena/client';
import type { IPactCommand } from '@kadena/client';
import type { ISignFunction } from '@kadena/client';

// Warning: (ae-forgotten-export) The symbol "IClientConfig" needs to be exported by the entry point index.d.ts
//
// @alpha (undocumented)
export const createPrincipal: (inputs: ICreatePrincipalInput, config: Omit<IClientConfig, 'sign'>) => Promise<string>;

// @alpha (undocumented)
export const describeModule: (module: string, config: Omit<IClientConfig, 'sign'>) => Promise<IDescribeModuleOutput>;

// @alpha (undocumented)
export interface ICreatePrincipalInput {
    // (undocumented)
    keyset: {
        keys: string[];
        pred?: 'keys-all' | 'keys-2' | 'keys-any';
    };
}

// @alpha (undocumented)
export interface IDescribeModuleOutput {
    // (undocumented)
    blessed: string[];
    // (undocumented)
    code: string;
    // (undocumented)
    hash: string;
    // (undocumented)
    interfaces: string[];
    // (undocumented)
    keyset: string;
    // (undocumented)
    name: string;
}

// (No @packageDocumentation comment for this package)

```
