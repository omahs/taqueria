/**
 * Post-processing routines using the output from ts-to-zod
 */
import { exec } from 'child_process';
import { readFile, writeFile } from 'fs/promises';
import { join, resolve } from 'path';

const OUTFILE = resolve(join(__dirname, '../', 'out/types-zod.ts'));
const TSCONFIG = resolve(join(__dirname, '../', 'tsconfig.json'));

/**
 * ts-to-zod creates non-extensible schemas when it uses the .and() method
 * This postprocess routine will replace all uses of .and() with .extend()
 * @param fileContents
 * @returns {string}
 */
const toExtendableSchemas = (fileContents: string) => {
	const searchFor = /and\(\s+z\.object/mg;
	const replaceWith = 'extend(\n';
	return fileContents.replaceAll(searchFor, replaceWith);
};

// Ensure that the output is valid TypeScript
const ensureValidTS = () =>
	new Promise<void>((resolve, reject) =>
		exec(`npx tsc --noEmit --skipLibCheck ${OUTFILE}`, (error, stdout, stderr) => {
			if (stderr) reject(stderr);
			else if (error) reject(stdout ? stdout : error);
			else resolve();
		})
	);

const saveContents = (data: string) => writeFile(OUTFILE, data, { encoding: 'utf8' });

// Start post-processing
readFile(OUTFILE, { encoding: 'utf-8' })
	.then(toExtendableSchemas)
	.then(saveContents)
	.then(ensureValidTS)
	.catch(msg => {
		console.error(msg);
		process.exit(-1);
	});