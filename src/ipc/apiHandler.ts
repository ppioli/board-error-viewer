import { BrowserWindow } from 'electron';

export interface ApiHandler {
  register(window: BrowserWindow): void;
}
