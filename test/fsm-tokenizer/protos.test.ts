// tom-weatherhead/thaw-lexical-analyzer/test/fsm-tokenizer/protos.test.ts

'use strict';

import {
	LanguageSelector,
	LexicalAnalyzerSelector /*, LexicalState */
} from 'thaw-interpreter-types';

import { /* createToken, */ createTokenizer } from '../..';

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

// test('Protos tokenize EOF test', () => {
// 	// Arrange
// 	const inputString = '';
// 	const tokenizer = createTokenizer(
// 		LexicalAnalyzerSelector.FiniteStateMachine,
// 		LanguageSelector.Protos
// 	);
//
// 	// Act
// 	const actualValue = tokenizer.tokenize(inputString);
//
// 	// Assert
// 	expect(actualValue.length).toBe(1);
//
// 	// toBe() does a shallow comparison; toStrictEqual() does a deep comparison.
// 	expect(actualValue).toStrictEqual([createToken(LexicalState.tokenEOF, 'EOF', 1, 1, false)]);
// });
//
// test('Protos tokenize plus EOF test', () => {
// 	// Arrange
// 	const inputString = '+';
// 	const tokenizer = createTokenizer(
// 		LexicalAnalyzerSelector.FiniteStateMachine,
// 		LanguageSelector.Protos
// 	);
//
// 	// Act
// 	const actualValue = tokenizer.tokenize(inputString);
//
// 	// Assert
// 	expect(actualValue.length).toBe(2);
//
// 	// toBe() does a shallow comparison; toStrictEqual() does a deep comparison.
// 	expect(actualValue).toStrictEqual([
// 		createToken(LexicalState.tokenPlus, '+', 1, 1, false),
// 		createToken(LexicalState.tokenEOF, 'EOF', 1, 2, false)
// 	]);
// });
//
// test('Protos tokenize plus plus EOF test', () => {
// 	// Arrange
// 	const inputString = '+ +';
// 	const tokenizer = createTokenizer(
// 		LexicalAnalyzerSelector.FiniteStateMachine,
// 		LanguageSelector.Protos
// 	);
//
// 	// Act
// 	const actualValue = tokenizer.tokenize(inputString);
//
// 	// Assert
// 	expect(actualValue.length).toBe(3);
//
// 	// toBe() does a shallow comparison; toStrictEqual() does a deep comparison.
// 	expect(actualValue).toStrictEqual([
// 		createToken(LexicalState.tokenPlus, '+', 1, 1, false),
// 		createToken(LexicalState.tokenPlus, '+', 1, 3, false),
// 		createToken(LexicalState.tokenEOF, 'EOF', 1, 4, false)
// 	]);
// });
//
// test('Protos tokenize id plus id EOF test', () => {
// 	// Arrange
// 	const inputString = '  abc + def  ';
// 	const tokenizer = createTokenizer(
// 		LexicalAnalyzerSelector.FiniteStateMachine,
// 		LanguageSelector.Protos
// 	);
//
// 	// Act
// 	const actualValue = tokenizer.tokenize(inputString);
//
// 	// Assert
// 	expect(actualValue.length).toBe(4);
//
// 	// toBe() does a shallow comparison; toStrictEqual() does a deep comparison.
// 	expect(actualValue).toStrictEqual([
// 		createToken(LexicalState.tokenIdent, 'abc', 1, 3, false),
// 		createToken(LexicalState.tokenPlus, '+', 1, 7, false),
// 		createToken(LexicalState.tokenIdent, 'def', 1, 9, false),
// 		createToken(LexicalState.tokenEOF, 'EOF', 1, 14, false)
// 	]);
// });
//
// test('Protos tokenize assign plus EOF test', () => {
// 	// Arrange
// 	const inputString = ':=+';
// 	const tokenizer = createTokenizer(
// 		LexicalAnalyzerSelector.FiniteStateMachine,
// 		LanguageSelector.Protos
// 	);
//
// 	// Act
// 	const actualValue = tokenizer.tokenize(inputString);
//
// 	// Assert
// 	expect(actualValue.length).toBe(3);
//
// 	// toBe() does a shallow comparison; toStrictEqual() does a deep comparison.
// 	expect(actualValue).toStrictEqual([
// 		createToken(LexicalState.tokenAssign, ':=', 1, 1, false),
// 		createToken(LexicalState.tokenPlus, '+', 1, 3, false),
// 		createToken(LexicalState.tokenEOF, 'EOF', 1, 4, false)
// 	]);
// });
//
// test('Protos tokenize int plus int EOF test', () => {
// 	// Arrange
// 	const inputString = '  123 + 456  ';
// 	const tokenizer = createTokenizer(
// 		LexicalAnalyzerSelector.FiniteStateMachine,
// 		LanguageSelector.Protos
// 	);
//
// 	// Act
// 	const actualValue = tokenizer.tokenize(inputString);
//
// 	// Assert
// 	expect(actualValue.length).toBe(4);
//
// 	// toBe() does a shallow comparison; toStrictEqual() does a deep comparison.
// 	expect(actualValue).toStrictEqual([
// 		createToken(LexicalState.tokenIntLit, 123, 1, 3, false),
// 		createToken(LexicalState.tokenPlus, '+', 1, 7, false),
// 		createToken(LexicalState.tokenIntLit, 456, 1, 9, false),
// 		createToken(LexicalState.tokenEOF, 'EOF', 1, 14, false)
// 	]);
// });
