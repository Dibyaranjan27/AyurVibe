import 'react';

declare module 'react' {
  interface CSSProperties {
    WebkitTextStroke?: string;
    textStroke?: string;
  }
}