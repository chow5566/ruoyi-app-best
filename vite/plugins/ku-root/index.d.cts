import { Plugin } from 'vite';

interface UniKuRootOptions {
    enabledGlobalRef?: boolean;
}
declare function UniKuRoot(options?: UniKuRootOptions): Plugin;

export { UniKuRoot as default };
