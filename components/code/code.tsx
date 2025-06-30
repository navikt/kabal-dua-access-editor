import '@/components/code/code.css';
import { BoxNew, Theme } from '@navikt/ds-react';
import { common, createStarryNight } from '@wooorm/starry-night';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import { CopyButton } from '@/components/copy-button';
import { ThemeEnum } from '@/components/theme/common';

interface CodeProps {
  lang: string;
  children: string;
}

const starryNight = await createStarryNight(common);

export const Code = ({ children, lang }: CodeProps) => {
  // const theme = useTheme();
  const scope = starryNight.flagToScope(lang);

  if (scope === undefined) {
    console.warn(`No syntax highlighting available for language: ${lang}`);
    return null;
  }

  const tree = starryNight.highlight(children, scope);

  return (
    <Theme theme={ThemeEnum.DARK}>
      <BoxNew position="relative" background="default" padding="8" width="fit-content" minWidth="100%">
        <CopyButton className="fixed top-8 right-8" text={children}>
          Kopier kode
        </CopyButton>

        <code lang={lang} className="w-fit min-w-full block whitespace-pre">
          {toJsxRuntime(tree, { Fragment, jsx, jsxs })}
        </code>
      </BoxNew>
    </Theme>
  );
};
