import type { RowUsecase } from '@/lib/data';
import type { Access } from '@/lib/enums/access';
import type { ActionEnum } from '@/lib/enums/actions';

export const sendAccessUpdateWithAbort = (usecase: RowUsecase, action: ActionEnum, access: Access) => {
  const abortController = new AbortController();

  return {
    success: sendAccessUpdate(usecase, action, access, abortController.signal),
    abort: () => abortController.abort(),
  };
};

export const sendAccessUpdate = async (
  usecase: RowUsecase,
  action: ActionEnum,
  access: Access,
  abortSignal?: AbortSignal,
) => {
  const { user, caseStatus, documentType, parent, creator } = usecase;

  try {
    const res = await fetch(`/api/access/${user}/${caseStatus}/${documentType}/${parent}/${creator}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, access }),
      signal: abortSignal,
    });

    if (!res.ok) {
      throw new Error(`Failed to update access: ${res.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Failed to update access:', error);
    return false;
  }
};
