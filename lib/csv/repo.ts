import { readCsv } from '@/lib/csv/read';
import { writeCsv } from '@/lib/csv/write';
import type { ParsedCsv, ParsedRow, RowActions } from '@/lib/data';
import { Access } from '@/lib/enums/access';
import { ActionEnum } from '@/lib/enums/actions';
import type { CaseStatus } from '@/lib/enums/case-status';
import type { CreatorEnum } from '@/lib/enums/creator';
import type { DocumentTypeEnum } from '@/lib/enums/document-type';
import type { ParentEnum } from '@/lib/enums/parent';
import type { UserEnum } from '@/lib/enums/user';
import { matchUsecase } from '@/lib/usecase';

class CsvRepo {
  private saved: ParsedCsv | null = null;
  private draft: ParsedCsv | null = null;

  public async getDraft(): Promise<ParsedCsv> {
    if (this.draft === null) {
      this.draft = await this.getSaved();
    }

    return this.draft;
  }

  public async getSaved(): Promise<ParsedCsv> {
    if (this.saved === null) {
      this.saved = await readCsv();
    }

    return this.saved;
  }

  public async setActionAccess(
    user: UserEnum,
    caseStatus: CaseStatus,
    documentType: DocumentTypeEnum,
    parent: ParentEnum,
    creator: CreatorEnum,
    action: ActionEnum,
    access: Access,
  ): Promise<void> {
    const draft = await this.getDraft();
    const { rows } = draft;

    const rowToUpdate = rows.find((row) =>
      matchUsecase(row.usecase, { user, caseStatus, documentType, parent, creator }),
    );

    if (!rowToUpdate) {
      console.debug(
        `No row found for user: ${user}, caseStatus: ${caseStatus}, documentType: ${documentType}, parent: ${parent}, creator: ${creator}, action: ${action}. Creating a new row.`,
      );

      const newRow: ParsedRow = {
        usecase: { user, caseStatus, documentType, parent, creator },
        actions: { ...NEW_ACCESS, [action]: access },
      };

      this.draft = { ...draft, rows: [...rows, newRow] };
    } else {
      const updatedRows = rows.map((row) => {
        const { usecase, actions } = row;

        if (row === rowToUpdate) {
          return { usecase, actions: { ...actions, [action]: access } };
        }

        return row;
      });

      this.draft = { ...draft, rows: updatedRows };
    }

    this.#save();
  }

  // Debounce timer for saveDraft.
  private saveTimer: NodeJS.Timeout | null = null;

  #save(): void {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
    }

    this.saveTimer = setTimeout(async () => {
      const beforeSave = await this.getSaved();

      try {
        const draft = await this.getDraft();
        this.saved = draft;
        await writeCsv(draft);
      } catch (error) {
        console.error('Failed to write CSV:', error);
        this.saved = beforeSave; // Revert to previous state if save fails.
        throw error; // Re-throw the error after reverting.
      }
    }, 300);
  }
}

export const CSV_REPO = new CsvRepo();

const NEW_ACCESS: RowActions = {
  [ActionEnum.CREATE]: Access.UNSET,
  [ActionEnum.WRITE]: Access.UNSET,
  [ActionEnum.REMOVE]: Access.UNSET,
  [ActionEnum.CHANGE_TYPE]: Access.UNSET,
  [ActionEnum.RENAME]: Access.UNSET,
  [ActionEnum.FINISH]: Access.UNSET,
};
