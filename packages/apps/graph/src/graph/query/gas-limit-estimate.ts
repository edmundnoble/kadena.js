import { COMPLEXITY } from '@services/complexity';
import { estimateGas } from '@services/node-service';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';

const PactTransaction = builder.inputType('PactTransaction', {
  fields: (t) => ({
    cmd: t.field({ type: 'String', required: true }),
    hash: t.field({ type: 'String' }),
    sigs: t.field({ type: ['String'] }),
  }),
});

builder.queryField('gasLimitEstimate', (t) =>
  t.field({
    description: 'Estimate the gas limit for a transaction.',
    type: 'Int',
    args: {
      transaction: t.arg({ type: PactTransaction, required: true }),
    },
    complexity: COMPLEXITY.FIELD.CHAINWEB_NODE,
    async resolve(__parent, args) {
      try {
        if (args.transaction.cmd.includes(`\\`)) {
          args.transaction.cmd = args.transaction.cmd.replace(/\\\\/g, '\\');
        }

        const result = await estimateGas({
          cmd: args.transaction.cmd,
          hash: args.transaction.hash,
          sigs: args.transaction.sigs,
        });

        return result.gas;
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);

builder.queryField('gasLimitEstimates', (t) =>
  t.field({
    description: 'Estimate the gas limit for a list of transactions.',
    type: ['Int'],
    args: {
      transactions: t.arg({ type: [PactTransaction], required: true }),
    },
    complexity: (args) => ({
      field: COMPLEXITY.FIELD.CHAINWEB_NODE * args.transactions.length,
    }),
    async resolve(__parent, args) {
      try {
        const gasEstimatePromises = args.transactions.map((transaction) => {
          if (transaction.cmd.includes('//')) {
            transaction.cmd = transaction.cmd.replace(/\/\//g, '/');
          }

          return estimateGas({
            cmd: transaction.cmd,
            hash: transaction.hash,
            sigs: transaction.sigs,
          });
        });

        const results = await Promise.all(gasEstimatePromises);
        const gasEstimates = results.map((result) => result.gas);

        return gasEstimates;
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);
