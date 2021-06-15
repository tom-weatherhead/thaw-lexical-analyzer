// tom-weatherhead/thaw-lexical-analyzer/test/chapter1.test.ts

'use strict';

import {
	createTokenizer,
	LanguageSelector,
	LexicalAnalyzerSelector,
	LexicalState,
	Token
} from '..';

// function testToken(token: engine.Token, tokenType: number, tokenValue: any, lineNumber: number, columnNumber: number, isQuoted: boolean) {
// 	expect(token.tokenType).toBe(tokenType);
// 	expect(token.tokenValue).toBe(tokenValue);
// 	expect(token.line).toBe(lineNumber);
// 	expect(token.column).toBe(columnNumber);
// 	expect(token.isQuoted).toBe(isQuoted);
// }

test('Create Chapter 1 tokenizer', () => {
	// Arrange
	// const expectedValue: string = 'The result of test()';

	// Act
	// console.log(`engine.gsChapter1 is ${engine.gsChapter1}`);
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
	// const expectedValue: string = 'The result of test()';

	// Act
	const actualValue = tokenizer.tokenize(inputString);
	// console.log(`Token array is`, actualValue);

	// Assert
	// expect(actualValue).toBeTruthy();
	// expect(actualValue.length).toBe(6);

	// testToken(actualValue[0], engine.tokenLeftBracket, '(', 1, 1, false);
	// testToken(actualValue[1], engine.tokenPlus, '+', 1, 2, false);
	// testToken(actualValue[2], engine.tokenIntLit, 2, 1, 4, false);
	// testToken(actualValue[3], engine.tokenIntLit, 3, 1, 6, false);
	// testToken(actualValue[4], engine.tokenRightBracket, ')', 1, 7, false);
	// testToken(actualValue[5], engine.tokenEOF, 'EOF', 1, 8, false);

	// toBe() does a shallow comparison; toStrictEqual() does a deep comparison.
	expect(actualValue).toStrictEqual([
		new Token(LexicalState.tokenLeftBracket, '(', 1, 1, false),
		new Token(LexicalState.tokenPlus, '+', 1, 2, false),
		new Token(LexicalState.tokenIntLit, 2, 1, 4, false),
		new Token(LexicalState.tokenIntLit, 3, 1, 6, false),
		new Token(LexicalState.tokenRightBracket, ')', 1, 7, false),
		new Token(LexicalState.tokenEOF, 'EOF', 1, 8, false)
	]);
});
