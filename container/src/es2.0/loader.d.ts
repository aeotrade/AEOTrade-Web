
import { ParcelConfigObject } from 'single-spa';
import { FrameworkConfiguration, FrameworkLifeCycles, LoadableApp } from './interfaces';
export declare function loadApp<T extends object>(app: LoadableApp<T>, configuration?: FrameworkConfiguration, lifeCycles?: FrameworkLifeCycles<T>): Promise<ParcelConfigObject>;
