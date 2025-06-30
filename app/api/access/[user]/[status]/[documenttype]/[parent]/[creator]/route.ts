import type { NextRequest } from 'next/server';
import { setActionAccess } from '@/lib/csv/update';
import { type Access, isAccess } from '@/lib/enums/access';
import { type ActionEnum, isAction } from '@/lib/enums/actions';
import { isCaseStatus } from '@/lib/enums/case-status';
import { isCreator } from '@/lib/enums/creator';
import { isDocumentType } from '@/lib/enums/document-type';
import { isParent } from '@/lib/enums/parent';
import { isUser } from '@/lib/enums/user';

export const dynamic = 'force-dynamic';

interface AccessParams {
  user: string;
  status: string;
  documenttype: string;
  parent: string;
  creator: string;
}

type Handler<P> = (req: NextRequest, params: { params: Promise<P> }) => Promise<Response>;

export const POST: Handler<AccessParams> = async (req, { params }) => {
  const { user, status, documenttype, parent, creator } = await params;
  const body = await req.json();

  if (
    !isUser(user) ||
    !isCaseStatus(status) ||
    !isDocumentType(documenttype) ||
    !isParent(parent) ||
    !isCreator(creator)
  ) {
    return Response.json(
      { error: 'Invalid parameters', parameters: { user, status, documenttype, parent, creator } },
      { status: 400 },
    );
  }

  if (!isValidBody(body)) {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { action, access } = body;

  try {
    const updatedCsv = await setActionAccess(user, status, documenttype, parent, creator, action, access);

    return Response.json(updatedCsv, { status: 200 });
  } catch (error) {
    console.error('Failed to update access:', error);

    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to update access' },
      { status: 500 },
    );
  }
};

interface AccessBody {
  action: ActionEnum;
  access: Access;
}

const isValidBody = (body: unknown): body is AccessBody =>
  body !== null &&
  typeof body === 'object' &&
  'action' in body &&
  'access' in body &&
  isAction(body.action) &&
  isAccess(body.access);
