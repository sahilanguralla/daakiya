declare module '*.css' {
    const content: {[className: string]: string};
    export default content;
}

declare global {
    interface Window {
      __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}