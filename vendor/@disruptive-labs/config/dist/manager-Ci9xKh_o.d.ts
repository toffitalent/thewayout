type NoInferType<T> = [T][T extends any ? 0 : never];
declare class Manager<K = Record<string, any>> {
    private readonly internalConfig;
    constructor(internalConfig?: Record<string, any>);
    get<T = any>(path: keyof K): T | undefined;
    get<T = any>(path: keyof K, defaultValue: NoInferType<T>): T;
    merge(config: Partial<K>): void;
    set(path: keyof K, value: any): void;
    environment(): string;
    environment(...environments: string[]): boolean;
    getEnv(key: string): string | undefined;
    getEnv(): Record<string, string> | undefined;
}

export { Manager as M };
