// tom-weatherhead/thaw-lexical-analyzer/src/tokenizer-factory.ts

import { ITokenizer, LanguageSelector, LexicalAnalyzerSelector } from 'thaw-interpreter-types';

import { FSMTokenizer } from './fsm-tokenizer';
import { MidnightHackTokenizer } from './midnight-hack-tokenizer';
import { TokenizerException } from './tokenizer-exception';

export function createTokenizer(las: LexicalAnalyzerSelector, ls: LanguageSelector): ITokenizer {
	switch (las) {
		case LexicalAnalyzerSelector.FiniteStateMachine:
			return new FSMTokenizer(ls);

		case LexicalAnalyzerSelector.MidnightHack:
			return new MidnightHackTokenizer(ls);

		default:
			throw new TokenizerException(
				`createTokenizer() : Unsupported LexicalAnalyzerSelector ${las}`
			);
	}
}
