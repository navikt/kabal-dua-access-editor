import { BoxNew, HStack, Tag, VStack } from '@navikt/ds-react';
import { ACTION_COLORS, ACTION_NAMES, ActionEnum } from '@/lib/enums/actions';
import { CASE_STATUS_COLORS, CASE_STATUS_NAMES, type CaseStatus } from '@/lib/enums/case-status';
import { CREATOR_COLORS, CREATOR_NAMES, CreatorEnum } from '@/lib/enums/creator';
import { DOCUMENT_TYPE_COLORS, DOCUMENT_TYPE_NAMES, type DocumentTypeEnum } from '@/lib/enums/document-type';
import { PARENT_COLORS, PARENT_NAMES, ParentEnum } from '@/lib/enums/parent';
import { USER_COLORS, USER_NAMES, UserEnum } from '@/lib/enums/user';

interface Props {
  user: UserEnum;
  status: CaseStatus;
  documentType: DocumentTypeEnum;
  parent: ParentEnum;
  creator: CreatorEnum;
  action: ActionEnum;
}

export const Description = ({ user, status, documentType, parent, creator, action }: Props) => (
  <BoxNew
    minWidth="400px"
    background="default"
    shadow="dialog"
    borderRadius="medium"
    overflow="hidden"
    padding="4"
    className="text-text-default"
  >
    <VStack gap="2">
      <div className="font-bold">
        {ACTION_NAMES[action]} {parent === ParentEnum.NONE ? 'dokument' : 'vedlegg'}
      </div>

      <div>
        <span>For en </span>
        <Tag variant={USER_COLORS[user]} size="xsmall">
          {USER_NAMES[user]}
        </Tag>
        <span> som ser på en sak som er </span>
        <Tag variant={CASE_STATUS_COLORS[status]} size="xsmall">
          {CASE_STATUS_NAMES[status]}
        </Tag>
        <span> med et </span>
        <Tag variant={DOCUMENT_TYPE_COLORS[documentType]} size="xsmall">
          {DOCUMENT_TYPE_NAMES[documentType]}
        </Tag>

        {parent === ParentEnum.NONE ? (
          <span> dokument.</span>
        ) : (
          <>
            <span> dokument som er vedlegg til et </span>
            <Tag variant={PARENT_COLORS[parent]} size="xsmall">
              {PARENT_NAMES[parent]}
            </Tag>
            <span> dokument.</span>
          </>
        )}
      </div>

      <div>
        {action === ActionEnum.CREATE ? (
          <CreatorTag creator={USER_TO_CREATOR[user]}>Dokumentet blir opprettet av</CreatorTag>
        ) : (
          <CreatorTag creator={creator}>Dokumentet er opprettet av</CreatorTag>
        )}
      </div>

      <div>
        <span>Kan bruker </span>
        <Tag variant={ACTION_COLORS[action]} size="xsmall">
          {ACTION_NAMES[action].toLowerCase()}
        </Tag>
        <span> {parent === ParentEnum.NONE ? 'dokumentet' : 'vedlegget'}?</span>
      </div>
    </VStack>
  </BoxNew>
);

interface CreatorTagProps {
  creator: CreatorEnum;
  children: string;
}

const CreatorTag = ({ creator, children }: CreatorTagProps) => (
  <HStack gap="1" align="center">
    <span>{children}:</span>
    <Tag variant={CREATOR_COLORS[creator]} size="xsmall">
      {CREATOR_NAMES[creator]}
    </Tag>
  </HStack>
);

const USER_TO_CREATOR: Record<UserEnum, CreatorEnum> = {
  [UserEnum.TILDELT_SAKSBEHANDLER]: CreatorEnum.KABAL_SAKSBEHANDLING,
  [UserEnum.SAKSBEHANDLER]: CreatorEnum.NONE,
  [UserEnum.TILDELT_MEDUNDERSKRIVER]: CreatorEnum.KABAL_MEDUNDERSKRIVER,
  [UserEnum.ROL]: CreatorEnum.NONE,
  [UserEnum.TILDELT_ROL]: CreatorEnum.KABAL_ROL,
};
