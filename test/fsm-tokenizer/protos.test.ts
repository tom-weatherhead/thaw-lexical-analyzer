// tom-weatherhead/thaw-lexical-analyzer/test/fsm-tokenizer/protos.test.ts

'use strict';

import { LanguageSelector, LexicalAnalyzerSelector, LexicalState } from 'thaw-interpreter-types';

import { createToken, createTokenizer } from '../..';

test('Create Protos tokenizer', () => {
	// Arrange
	// Act
	const actualValue = createTokenizer(
		LexicalAnalyzerSelector.FiniteStateMachine,
		LanguageSelector.Protos
	);

	// Assert
	expect(actualValue).toBeTruthy();
});

test('Protos tokenize EOF test', () => {
	// Arrange
	const inputString = '';
	const tokenizer = createTokenizer(
		LexicalAnalyzerSelector.FiniteStateMachine,
		LanguageSelector.Protos
	);

	// Act
	const actualValue = tokenizer.tokenize(inputString);

	// Assert
	expect(actualValue.length).toBe(1);

	// toBe() does a shallow comparison; toStrictEqual() does a deep comparison.
	expect(actualValue).toStrictEqual([createToken(LexicalState.tokenEOF, 'EOF', 1, 1, false)]);
});
