'use client';

import { sendAccessUpdate, sendAccessUpdateWithAbort } from '@/components/table/access/update';
import type { RowUsecase } from '@/lib/data';
import type { Access } from '@/lib/enums/access';
import type { ActionEnum } from '@/lib/enums/actions';
import { isMetaKey } from '@/lib/meta-key';
import { usecaseToKey } from '@/lib/usecase-key';

interface HistoryEntry {
  usecase: RowUsecase;
  action: ActionEnum;
  from: Access;
  to: Access;
  abort: () => void;
  success: Promise<boolean>;
  timestamp: Date;
}

export type HistoryListener = (access: Access) => void;

class History {
  #undoStack: HistoryEntry[] = [];
  #redoStack: HistoryEntry[] = [];
  #listeners: Record<string, HistoryListener[]> = {};

  addListener(usecase: RowUsecase, action: ActionEnum, listener: HistoryListener) {
    const key = `${usecaseToKey(usecase)}-${action}`;

    const existingListeners = this.#listeners[key];
    if (existingListeners === undefined) {
      this.#listeners[key] = [listener];
    } else {
      existingListeners.push(listener);
    }

    return () => this.removeListener(usecase, action, listener);
  }

  removeListener(usecase: RowUsecase, action: ActionEnum, listener: HistoryListener) {
    const key = `${usecaseToKey(usecase)}-${action}`;

    const existingListeners = this.#listeners[key];

    if (existingListeners !== undefined) {
      this.#listeners[key] = existingListeners.filter((l) => l !== listener);
    }
  }

  update(usecase: RowUsecase, action: ActionEnum, from: Access, to: Access) {
    const res = sendAccessUpdateWithAbort(usecase, action, to); // Send update to the API
    this.#undoStack.push({ usecase, action, from, to, ...res, timestamp: new Date() });
    this.#redoStack = []; // Clear redo stack on new entry

    return res;
  }

  async undo() {
    const entry = this.#undoStack.at(-1);

    if (entry === undefined) {
      console.debug('No actions to undo');
      return;
    }

    console.debug('Undoing last action');

    const { usecase, action, from, to, abort } = entry;

    abort();
    const key = `${usecaseToKey(usecase)}-${action}`;
    const listeners = this.#listeners[key];
    if (listeners !== undefined) {
      for (const listener of listeners) {
        listener(from);
      }
    }

    const success = await sendAccessUpdate(usecase, action, from);

    if (success) {
      this.#redoStack.push(entry);
      this.#undoStack = this.#undoStack.slice(0, -1); // Remove last entry from undo stack
    } else {
      console.debug('Failed to undo action');
      this.#undoStack.push(entry); // Re-add the entry to undo stack if undo fails
      this.#redoStack = this.#redoStack.filter((e) => e !== entry); // Keep the entry in undo stack if undo fails

      // Notify listeners with the original state
      const listeners = this.#listeners[key];
      if (listeners !== undefined) {
        for (const listener of listeners) {
          listener(to);
        }
      }
    }
  }

  async redo() {
    const entry = this.#redoStack.at(-1);

    if (entry === undefined) {
      console.debug('No actions to redo');
      return;
    }

    console.debug('Redoing last action');

    const { usecase, action, from, to, abort } = entry;

    abort();
    const key = `${usecaseToKey(usecase)}-${action}`;
    const listeners = this.#listeners[key];

    if (listeners !== undefined) {
      for (const listener of listeners) {
        listener(to);
      }
    }

    const success = await sendAccessUpdate(usecase, action, to);

    if (success) {
      this.#undoStack.push(entry);
      this.#redoStack = this.#redoStack.slice(0, -1); // Remove last entry from redo stack
    } else {
      console.debug('Failed to redo action');
      this.#undoStack = this.#undoStack.filter((e) => e !== entry); // Remove the entry from undo stack if redo fails
      this.#redoStack.push(entry); // Re-add the entry to redo stack if redo fails

      // Notify listeners with the original state
      const listeners = this.#listeners[key];
      if (listeners !== undefined) {
        for (const listener of listeners) {
          listener(from);
        }
      }
    }
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (event) => {
    if (!isMetaKey(event)) {
      return; // Only handle Ctrl/Cmd + Z or Shift + Ctrl/Cmd + Z
    }

    if (event.key === 'z' && !event.shiftKey) {
      event.preventDefault();
      accessHistory.undo();
      return;
    }

    if (event.key === 'z' && event.shiftKey) {
      event.preventDefault();
      accessHistory.redo();
      return;
    }
  });
}
export const accessHistory = new History();
