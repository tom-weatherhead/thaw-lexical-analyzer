// tom-weatherhead/thaw-lexical-analyzer/test/midnight-hack-tokenizer/chapter1.test.ts

'use strict';

import { LanguageSelector, LexicalAnalyzerSelector, LexicalState } from 'thaw-interpreter-types';

import { createToken, createTokenizer } from '../..';

test('Create Chapter 1 tokenizer', () => {
	// Arrange
	// Act
	const tokenizer = createTokenizer(
		LexicalAnalyzerSelector.MidnightHack,
		LanguageSelector.Chapter1
	);

	// Assert
	expect(tokenizer).toBeTruthy();
});

test('Chapter 1 tokenizer test 1', () => {
	// Arrange
	const inputString = '(+ 2 3)';
	const tokenizer = createTokenizer(
		LexicalAnalyzerSelector.MidnightHack,
		LanguageSelector.Chapter1
	);

	// Act
	const actualValue = tokenizer.tokenize(inputString);

	// Assert

	// toBe() does a shallow comparison; toStrictEqual() does a deep comparison.
	expect(actualValue).toStrictEqual([
		createToken(LexicalState.tokenLeftBracket, '(', 1, 1, false),
		createToken(LexicalState.tokenPlus, '+', 1, 2, false),
		createToken(LexicalState.tokenIntLit, 2, 1, 4, false),
		createToken(LexicalState.tokenIntLit, 3, 1, 6, false),
		createToken(LexicalState.tokenRightBracket, ')', 1, 7, false),
		createToken(LexicalState.tokenEOF, 'EOF', 1, 8, false)
	]);
});
