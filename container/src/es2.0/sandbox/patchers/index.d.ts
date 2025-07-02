
import { Freer } from '../../interfaces';
export declare function patchAtMounting(appName: string, elementGetter: () => HTMLElement | ShadowRoot, proxy: Window, singular: boolean): Freer[];
export declare function patchAtBootstrapping(appName: string, elementGetter: () => HTMLElement | ShadowRoot, proxy: Window, singular: boolean): Freer[];
