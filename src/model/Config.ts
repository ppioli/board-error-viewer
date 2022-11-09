export const GetSupportedEncoding = (): BufferEncoding[] => [
  'utf-8',
  'latin1',
  'ucs-2',
  'base64',
  'utf16le',
];

export interface Config {
  watchDir: string | null;
  encoding: BufferEncoding;
  extension?: string;
}

export const defaultConfig: Config = {
  watchDir: null,
  encoding: 'utf-8',
};
