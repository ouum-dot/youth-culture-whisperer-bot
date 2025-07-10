
/// <reference types="vite/client" />

interface BotpressWebchat {
  init: (config: any) => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  on: (event: string, callback: () => void) => void;
}

declare global {
  interface Window {
    botpress: BotpressWebchat;
  }
}

export {};
