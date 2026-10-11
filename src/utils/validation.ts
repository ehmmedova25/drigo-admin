import * as yup from 'yup';
import { FORM_MESSAGES } from '@/constants/messages';

const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;

const emptyToUndefined = (value: unknown, originalValue: unknown) =>
  originalValue === '' || originalValue === null ? undefined : value;

export const numberField = () => yup.number().typeError(FORM_MESSAGES.NUMBER).transform(emptyToUndefined);

export const idField = () => numberField().integer(FORM_MESSAGES.INTEGER).positive(FORM_MESSAGES.POSITIVE);

export const amountField = () => numberField().min(0, FORM_MESSAGES.NOT_NEGATIVE);

export const hexColorField = () => yup.string().matches(HEX_COLOR_PATTERN, FORM_MESSAGES.HEX_COLOR);
