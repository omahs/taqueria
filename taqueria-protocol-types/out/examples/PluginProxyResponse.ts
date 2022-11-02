// Generated file: Do not edit
// generated from @taqueria-protocol-types

// import { PluginProxyResponse, pluginProxyResponseSchema, parsingErrorMessages } from '@taqueria-protocol-types';
import { TaqError, toFutureParseErr, toFutureParseUnknownErr } from '@taqueria/protocol/TaqError';
import { FutureInstance, resolve } from 'fluture';
import { ZodError } from 'zod';
import { PluginProxyResponse as PluginProxyResponseStrict } from '../../../taqueria-protocol-types/out/types-strict';
import { parsingErrorMessages } from '../../helpers';
import { PluginProxyResponse } from '../../types';
import { pluginProxyResponseSchema } from '../types-zod';

// type PluginProxyResponseStrict = PluginProxyResponse & { __type: 'PluginProxyResponse' };
const { parseErrMsg, unknownErrMsg } = parsingErrorMessages('PluginProxyResponse');

export const from = (input: unknown): PluginProxyResponseStrict => {
	return pluginProxyResponseSchema.parse(input) as PluginProxyResponseStrict;
};

export const create = (input: PluginProxyResponse): PluginProxyResponseStrict => from(input);

export const of = (input: unknown): FutureInstance<TaqError, PluginProxyResponseStrict> => {
	try {
		return resolve(pluginProxyResponseSchema.parse(input) as PluginProxyResponseStrict);
	} catch (previous) {
		const parseMsg = parseErrMsg(input, previous);

		const unknownMsg = unknownErrMsg(input);

		if (previous instanceof ZodError) {
			return toFutureParseErr(previous, parseMsg, input);
		}
		return toFutureParseUnknownErr(previous, unknownMsg, input);
	}
};

export const make = (input: PluginProxyResponseStrict): FutureInstance<TaqError, PluginProxyResponseStrict> =>
	of(input);