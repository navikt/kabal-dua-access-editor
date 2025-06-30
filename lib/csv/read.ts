import { readFile } from 'node:fs/promises';
import { CSV_PATH } from '@/lib/csv/constants';
import { INITIAL_CSV } from '@/lib/csv/initial';
import { createInitialCsv } from '@/lib/csv/write';
import type { ParsedCsv, RowActions, RowUsecase } from '@/lib/data';
import { ACCESS_VALUES, Access, isAccess } from '@/lib/enums/access';
import { ActionEnum, isAction } from '@/lib/enums/actions';
import { isCaseStatus } from '@/lib/enums/case-status';
import { isCreator } from '@/lib/enums/creator';
import { isDocumentType } from '@/lib/enums/document-type';
import { isParent } from '@/lib/enums/parent';
import { UsecaseDimension } from '@/lib/enums/usecase';
import { isUser } from '@/lib/enums/user';

const EXPECTED_HEADER_VALUES = INITIAL_CSV.headers; // All expected header values in the CSV file.
const EXPECTED_COLUMN_COUNT = EXPECTED_HEADER_VALUES.length; // Total number of columns expected in the CSV file.

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This function is complex due to the nature of CSV parsing and validation.
export const readCsv = async (): Promise<ParsedCsv> => {
  const start = performance.now();

  try {
    const content = await readFileIfExists(CSV_PATH);

    if (content === null) {
      // If the file does not exist, create a new CSV with initial values.
      return createInitialCsv();
    }

    const lines = content
      .replace(/\r/g, '') // Remove carriage returns for consistent line endings.
      .split('\n') // Split by new lines.
      .map((line) =>
        line
          .trim()
          .split(',')
          .map((value) => value.trim()),
      ) // Trim each line and split by commas.
      .filter((line) => line.length === EXPECTED_COLUMN_COUNT); // Filter out any empty lines.

    if (lines.length === 0) {
      console.warn('No valid lines found in CSV file after processing. Creating a new CSV with initial values.');
      // If there are no lines after processing, return the initial CSV.
      return createInitialCsv();
    }

    const [headers, ...rows] = lines;

    // If the headers do not match the expected values, create and return a new CSV.
    if (!validateHeaders(headers)) {
      console.warn(
        `Invalid headers in CSV file. Creating a new CSV with initial values. Expected: ${EXPECTED_HEADER_VALUES.join(', ')}. Actual: ${headers?.join(', ')}`,
      );
      return createInitialCsv();
    }

    // If there are no rows, create and return a new CSV.
    if (rows.length === 0) {
      console.warn('No rows found in CSV file. Creating a new CSV with initial values.');
      return createInitialCsv();
    }

    const useCaseColumnIndexes: Record<UsecaseDimension, number> = {
      [UsecaseDimension.USER]: headers.indexOf(UsecaseDimension.USER),
      [UsecaseDimension.CASE_STATUS]: headers.indexOf(UsecaseDimension.CASE_STATUS),
      [UsecaseDimension.DOCUMENT_TYPE]: headers.indexOf(UsecaseDimension.DOCUMENT_TYPE),
      [UsecaseDimension.PARENT]: headers.indexOf(UsecaseDimension.PARENT),
      [UsecaseDimension.CREATOR]: headers.indexOf(UsecaseDimension.CREATOR),
    };

    const actionColumnIndexes: Record<ActionEnum, number> = {
      [ActionEnum.CREATE]: headers.indexOf(ActionEnum.CREATE),
      [ActionEnum.WRITE]: headers.indexOf(ActionEnum.WRITE),
      [ActionEnum.REMOVE]: headers.indexOf(ActionEnum.REMOVE),
      [ActionEnum.CHANGE_TYPE]: headers.indexOf(ActionEnum.CHANGE_TYPE),
      [ActionEnum.RENAME]: headers.indexOf(ActionEnum.RENAME),
      [ActionEnum.FINISH]: headers.indexOf(ActionEnum.FINISH),
    };

    const parsed: ParsedCsv = { headers, rows: [] };

    for (const [key, index] of Object.entries(actionColumnIndexes)) {
      if (index === -1) {
        throw new Error(`Missing header for "${key}".`);
      }
    }

    for (const row of rows) {
      if (row.length !== EXPECTED_COLUMN_COUNT) {
        console.warn('Row length does not match header length.', row);
        continue; // Skip rows that do not match the expected column count.
      }

      const user = row[useCaseColumnIndexes[UsecaseDimension.USER]];
      if (!isUser(user)) {
        throw new Error(`Invalid user value: "${user}".`);
      }

      const caseStatus = row[useCaseColumnIndexes[UsecaseDimension.CASE_STATUS]];
      if (!isCaseStatus(caseStatus)) {
        throw new Error(`Invalid case status value: "${caseStatus}".`);
      }

      const documentType = row[useCaseColumnIndexes[UsecaseDimension.DOCUMENT_TYPE]];
      if (!isDocumentType(documentType)) {
        throw new Error(`Invalid document type value: "${documentType}".`);
      }

      const parent = row[useCaseColumnIndexes[UsecaseDimension.PARENT]];
      if (!isParent(parent)) {
        throw new Error(`Invalid parent value: "${parent}".`);
      }

      const creator = row[useCaseColumnIndexes[UsecaseDimension.CREATOR]];
      if (!isCreator(creator)) {
        throw new Error(`Invalid creator value: "${creator}".`);
      }

      const usecase: RowUsecase = {
        user: user,
        caseStatus: caseStatus,
        documentType: documentType,
        parent: parent,
        creator: creator,
      };

      type Writeable<T> = { -readonly [P in keyof T]: T[P] };

      const actions: Writeable<RowActions> = {
        [ActionEnum.CREATE]: Access.UNSET,
        [ActionEnum.WRITE]: Access.UNSET,
        [ActionEnum.REMOVE]: Access.UNSET,
        [ActionEnum.CHANGE_TYPE]: Access.UNSET,
        [ActionEnum.RENAME]: Access.UNSET,
        [ActionEnum.FINISH]: Access.UNSET,
      };

      for (const [key, index] of Object.entries(actionColumnIndexes)) {
        if (!isAction(key)) {
          throw new Error(`Invalid action key: "${key}". Expected one of: ${ACCESS_VALUES.join(', ')}`);
        }

        const value = row[index];

        if (value === undefined) {
          throw new Error(`Missing value for "${key}" in row.`);
        }

        if (!isAccess(value)) {
          console.warn(
            `Invalid access value for "${key}": "${value}". Expected one of: ${ACCESS_VALUES.map((a) => `"${a}"`).join(', ')} Defaulting to Access.UNSET.`,
          );
          actions[key] = Access.UNSET;
        } else {
          actions[key] = value;
        }
      }

      parsed.rows.push({ usecase, actions });
    }

    return parsed;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Could not parse CSV file: ${error.message}`);
    }

    throw new Error('Could not parse CSV file');
  } finally {
    const duration = performance.now() - start;
    console.info(`CSV read and parsed in ${duration.toFixed(2)} ms`);
  }
};

const validateHeaders = (headers: string[] | undefined): headers is (UsecaseDimension | ActionEnum)[] =>
  headers !== undefined &&
  headers.length === EXPECTED_COLUMN_COUNT &&
  EXPECTED_HEADER_VALUES.every((value) => headers.includes(value));

const readFileIfExists = async (path: string): Promise<string | null> => {
  try {
    const content = await readFile(path, 'utf-8');
    const trimmed = content.trim();

    return trimmed.length > 0 ? trimmed : null; // Return null if the content is empty after trimming.
  } catch (error) {
    // Check that the error is an ENOENT error (file not found).
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return null; // If the file does not exist, return null.
    }

    throw error;
  }
};
