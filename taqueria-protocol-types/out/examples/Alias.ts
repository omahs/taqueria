// Generated file: Do not edit
// generated from @taqueria-protocol-types

// import { Alias, aliasSchema, parsingErrorMessages } from '@taqueria-protocol-types';
import { TaqError, toFutureParseErr, toFutureParseUnknownErr } from '@taqueria/protocol/TaqError';
import { FutureInstance, resolve } from 'fluture';
import { ZodError } from 'zod';
import { Alias as AliasStrict } from '../../../taqueria-protocol-types/out/types-strict';
import { parsingErrorMessages } from '../../helpers';
import { Alias } from '../../types';
import { aliasSchema } from '../types-zod';

// type AliasStrict = Alias & { __type: 'Alias' };
const { parseErrMsg, unknownErrMsg } = parsingErrorMessages('Alias');

export const from = (input: unknown): AliasStrict => {
	return aliasSchema.parse(input) as AliasStrict;
};

export const create = (input: Alias): AliasStrict => from(input);

export const of = (input: unknown): FutureInstance<TaqError, AliasStrict> => {
	try {
		return resolve(aliasSchema.parse(input) as AliasStrict);
	} catch (previous) {
		const parseMsg = parseErrMsg(input, previous);

		const unknownMsg = unknownErrMsg(input);

		if (previous instanceof ZodError) {
			return toFutureParseErr(previous, parseMsg, input);
		}
		return toFutureParseUnknownErr(previous, unknownMsg, input);
	}
};

export const make = (input: AliasStrict): FutureInstance<TaqError, AliasStrict> => of(input);