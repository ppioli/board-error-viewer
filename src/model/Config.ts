export const GetSupportedEncoding = (): BufferEncoding[] => [
  'utf-8',
  'latin1',
  'ucs-2',
  'base64',
  'utf16le',
];

export type SupportedLanguages = 'en' | 'es';

export const supportedLanguagesValues: () => SupportedLanguages[] = () => [
  'en',
  'es',
];

export const supportedLanguagesLabels: (lang: SupportedLanguages) => string = (
  lang
) => {
  switch (lang) {
    default:
      return 'INVALID_LANGUAGE';
    case 'en':
      return 'English';
    case 'es':
      return 'Español';
  }
};

export interface Config {
  watchDir: string | null;
  encoding: BufferEncoding;
  extension?: string;
  persistent?: boolean;
  language?: SupportedLanguages;
}

export const defaultConfig: Config = {
  watchDir: null,
  encoding: 'utf-8',
};
