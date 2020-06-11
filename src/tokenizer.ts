// tom-weatherhead/thaw-lexical-analyzer/src/tokenizer.ts

// The lexical analyzer (tokenizer) implementation corresponding to LexicalAnalyzerSelector.FiniteStateMachine

// TODO? : Combine this class into the class FSMTokenizer

'use strict';

import { FSMTokenizer } from './fsm-tokenizer';
import { LanguageSelector } from './language-selectors';
import { LexicalState } from './lexical-states';

// The tokenizer for the Micro and Inference languages.

export class Tokenizer extends FSMTokenizer {
	constructor(ls: number) {
		super(ls);

		this.acceptableTokens.push(LexicalState.tokenAssign); // := is a Micro token.

		this.addTransition(
			LexicalState.tokenColon,
			'=',
			LexicalState.tokenAssign
		);

		if (ls === LanguageSelector.Inference) {
			this.acceptableTokens.push(LexicalState.tokenBoolIdent);
			this.acceptableTokens.push(LexicalState.tokenSkolemIdent);
			this.acceptableTokens.push(LexicalState.token2OrBar);
			this.acceptableTokens.push(LexicalState.token2Ampersand);
			this.acceptableTokens.push(LexicalState.tokenExclamation);
			this.acceptableTokens.push(LexicalState.tokenVariable);
			this.acceptableTokens.push(LexicalState.tokenLessEqual);

			this.addTransition(
				LexicalState.stateStart,
				'&',
				LexicalState.stateAmpersand
			);
			this.addTransition(
				LexicalState.stateStart,
				'?',
				LexicalState.stateQuestion
			);
			this.addTransition(
				LexicalState.stateStart,
				'!',
				LexicalState.tokenExclamation
			);
			this.addTransition(
				LexicalState.stateStart,
				'$',
				LexicalState.stateDollar
			);
			this.addTransition(
				LexicalState.stateDollar,
				'A',
				LexicalState.tokenSkolemIdent
			);
			this.addTransition(
				LexicalState.tokenSkolemIdent,
				'A',
				LexicalState.tokenSkolemIdent
			);
			this.addTransition(
				LexicalState.tokenSkolemIdent,
				'0',
				LexicalState.tokenSkolemIdent
			);
			this.addTransition(
				LexicalState.tokenSkolemIdent,
				'_',
				LexicalState.tokenSkolemIdent
			);
			this.addTransition(
				LexicalState.tokenLess,
				'=',
				LexicalState.tokenLessEqual
			);
			this.addTransition(
				LexicalState.stateQuestion,
				'A',
				LexicalState.tokenVariable
			);
			this.addTransition(
				LexicalState.tokenVariable,
				'A',
				LexicalState.tokenVariable
			);
			this.addTransition(
				LexicalState.tokenVariable,
				'0',
				LexicalState.tokenVariable
			);
			this.addTransition(
				LexicalState.tokenVariable,
				'_',
				LexicalState.tokenVariable
			);
			this.addTransition(
				LexicalState.tokenOrBar,
				'|',
				LexicalState.token2OrBar
			);
			this.addTransition(
				LexicalState.stateAmpersand,
				'&',
				LexicalState.token2Ampersand
			);
			this.addTransition(
				LexicalState.stateStart,
				'@',
				LexicalState.stateAt
			);
			this.addTransition(
				LexicalState.stateAt,
				'A',
				LexicalState.tokenBoolIdent
			);
			this.addTransition(
				LexicalState.tokenBoolIdent,
				'A',
				LexicalState.tokenBoolIdent
			);
			this.addTransition(
				LexicalState.tokenBoolIdent,
				'0',
				LexicalState.tokenBoolIdent
			);
			this.addTransition(
				LexicalState.tokenBoolIdent,
				'_',
				LexicalState.tokenBoolIdent
			);
		}
	}

	// protected override object ExtendedGetTokenValue(ref TokenType s, string token_str)
	// {

	// 	if (ls != LanguageSelector.Inference)
	// 	{
	// 		return null;
	// 	}

	// 	switch (s)
	// 	{
	// 		case TokenType.T_BoolIdent:
	// 		case TokenType.T_SkolemIdent:
	// 		case TokenType.T_Variable:
	// 			return token_str.Substring(1);     // Omit the @ or $ or ? at the beginning.

	// 		default:
	// 			return null;
	// 	}
	// }
}
