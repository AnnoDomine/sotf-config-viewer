export function isTypeOf<T>(check: any): check is T {
    if (check as T) {
        return true;
    }
    return false;
}

export function isInstanceOf(type: string, instance: any): boolean {
    return typeof instance === type;
}
