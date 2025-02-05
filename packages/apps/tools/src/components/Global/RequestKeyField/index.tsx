import type { ITextFieldProps } from '@kadena/react-ui';
import { SystemIcon, TextField } from '@kadena/react-ui';
import useTranslation from 'next-translate/useTranslation';
import type { FC } from 'react';
import React, { forwardRef } from 'react';
import * as z from 'zod';

export const RequestLength: { MIN: number; MAX: number } = { MIN: 43, MAX: 44 };

export const REQUEST_KEY_VALIDATION = z
  .string()
  .trim()
  .refine(
    (val) => {
      if (val.length === RequestLength.MAX) {
        return val[val.length - 1] === '=';
      }
      return val.length === RequestLength.MIN;
    },
    {
      message:
        'Your request key is invalid. Please provide a valid request key.',
    },
  );

export const RequestKeyField: FC<ITextFieldProps> = forwardRef<
  HTMLInputElement,
  ITextFieldProps
>(function RequestKeyField(props, ref) {
  const { t } = useTranslation('common');

  return (
    <TextField
      ref={ref}
      label={t('Request Key')}
      id="request-key-input"
      placeholder={t('Enter Request Key')}
      startAddon={<SystemIcon.KeyIconFilled />}
      {...props}
    />
  );
});
