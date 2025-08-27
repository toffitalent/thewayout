declare let __webpack_public_path__: string;

declare module '*.pug' {
  const content: (params: any) => string;

  export default content;
}
