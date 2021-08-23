// tom-weatherhead/thaw-lexical-analyzer/src/tokenizer-factory.ts

import { ITokenizer, LexicalAnalyzerSelector } from 'thaw-interpreter-types';

import { InterpreterTokenizer } from './interpreter-tokenizer';
// import { ITokenizer } from './itokenizer';
// import { LexicalAnalyzerSelector } from './lexical-analyzer-selectors';
import { Tokenizer } from './tokenizer';
import { TokenizerException } from './tokenizer-exception';

export function createTokenizer(las: number, gs: number): ITokenizer {
	switch (las) {
		case LexicalAnalyzerSelector.MidnightHack:
			return new InterpreterTokenizer(gs);

		case LexicalAnalyzerSelector.FiniteStateMachine:
			return new Tokenizer(gs);

		default:
			throw new TokenizerException(
				`createTokenizer() : Unsupported LexicalAnalyzerSelector ${las}`
			);
	}
}
