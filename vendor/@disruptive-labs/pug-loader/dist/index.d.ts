import pug from 'pug';
import type { LoaderContext } from 'webpack';
export declare type PugLoaderOptions = pug.Options;
export default function pugLoader(this: LoaderContext<PugLoaderOptions>, source: any): void;
