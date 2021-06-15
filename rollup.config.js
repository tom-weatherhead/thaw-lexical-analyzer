// rollup.config.js

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { terser } = require('rollup-plugin-terser');

export default [
	{
		input: './dist/types/main.js',
		output: [
			{
				file: 'dist/thaw-lexical-analyzer.cjs.js',
				format: 'cjs',
				exports: 'named'
			},
			{
				file: 'dist/thaw-lexical-analyzer.esm.js',
				format: 'es',
				compact: true,
				plugins: [terser()]
			},
			{
				file: 'dist/thaw-lexical-analyzer.js',
				name: 'thaw-lexical-analyzer',
				format: 'umd',
				compact: true,
				plugins: [terser()]
			}
		]
	}
];
