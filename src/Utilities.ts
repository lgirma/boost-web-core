import {Dict, Nullable} from "./TypescriptUtils";
import {Func} from "mocha";

export function humanize(str: string) {
    return str
        .replace(/^[\s_]+|[\s_]+$/g, '')
        .replace(/[_\s]+/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^[a-z]/, function(m) { return m.toUpperCase(); })
        .trim();
}

export function camelToKebabCase(str: string) {
    return str.split('').map((letter, idx) => {
        return letter.toUpperCase() === letter
            ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
            : letter;
    }).join('');
}

export function kebabToCamelCase(str: string): string {
    return str.replace(/-([a-z])/gi,(s, group) =>  group.toUpperCase());
}

export function getFriendlyFileSize(bytes: number) {
    if (bytes < 1024)
        return bytes + ' bytes'
    else if (bytes < (1024**2))
        return Math.round(10* bytes / 1024)/10 + ' Kb'
    else if (bytes < (1024**3))
        return Math.round(10* bytes / (1024**2))/10 + ' Mb'
    else if (bytes < (1024**4))
        return Math.round(10* bytes / (1024**3))/10 + ' Gb'
    else
        return Math.round(10* bytes / (1024**4))/10 + ' Tb'
}

/**
 * Checks if the given string is empty or white space only.
 * @param str
 */
export function isEmpty(str: Nullable<string>) {
    return str == null || str.trim().length == 0;
}

export function isArray(a: any) {
    return a != null && Array.isArray(a);
}

/**
 * Matches date string in the formats YYYY/MM/DD or YYYY-MM-DD
 * @param str
 */
const dateRegex = '[1-2][0-9][0-9][0-9](\-|\/)[0-3][0-9](\-|\/)[0-3][0-9]'
const timeRegex = '([01][0-9]|2[0-3]):([012345][0-9])(:[012345][0-9])?'
export function isDate(str: string){
    return new RegExp(`^${dateRegex}$`).test(str);
}

export function isTime(str: string){
    return new RegExp(`^${timeRegex}$`).test(str);
}

export function isDateTime(str: string){
    const _regExp  = new RegExp(`^${dateRegex}\s${timeRegex}$`);
    return _regExp.test(str);
}

export function isYear(str: string){
    const _regExp  = new RegExp('^[1-2][0-9][0-9][0-9]$');
    return _regExp.test(str);
}

export function isFunc(val: any) {
    if (val == null)
        return false
    return val.constructor === Function || val.constructor === Object.getPrototypeOf(async function() {}).constructor
}

export function uuid() {
    // UUID v4
    return (([1e7] as any)+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, (c: any) =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}

export function toArray<T>(src: T|T[]|null): T[] {
    if (src == null) return []
    if (Array.isArray(src))
        return src;
    else return [src]
}

export function toArrayWithoutNulls<T>(src: Nullable<T>|Nullable<T>[]): T[] {
    if (src == null) return []
    if (Array.isArray(src))
        return src.filter(s => s != null) as T[];
    else
        return [src]
}

export function groupBy<T>(arr: T[], by: (item: T) => any): Dict<T[]> {
    return arr.reduce((rv, x) => {
        const key: any = by(x) ?? ''
        rv[key] ??= []
        rv[key].push(x);
        return rv;
    }, {} as Dict<T[]>);
}

export function parseBindingExpression(fn: Function): {body: string, args: string[]} {
    let code = fn.toString().trim()
    let arrowPos = code.indexOf('=>')
    if (arrowPos > -1) {
        let arg = code.substr(0, arrowPos)
        let body = code.substr(arrowPos + 2, code.length - arrowPos - 2)
        return {args: arg.trim().split(','), body: body.trim()}
    }
    let funcPos = code.indexOf('{')
    if (funcPos > -1) {
        let decl = code.substr(0, funcPos)
        let arg = decl.substr(decl.indexOf('(') + 1, decl.lastIndexOf(')') - decl.indexOf('(') - 1)
        let body = code.substr(funcPos + 1, code.lastIndexOf('}') - funcPos - 1)
        body = body.replace(/return|;/g, '')
        return {args: arg.trim().split(','), body: body.trim()}
    }
    return {body: '', args: []}
}