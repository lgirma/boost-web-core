
export function humanize(str) {
    return str
        .replace(/^[\s_]+|[\s_]+$/g, '')
        .replace(/[_\s]+/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^[a-z]/, function(m) { return m.toUpperCase(); });
}

export function getFriendlyFileSize(bytes) {
    if (bytes < 1024)
        return bytes + ' bytes'
    else if (bytes < 1024*1024)
        return Math.round(10* bytes / 1024)/10 + ' Kb'
    else
        return Math.round(10* bytes / (1024*1024))/10 + ' Mb'
}

/**
 * Checks if the given string is empty or white space only.
 * @param str
 */
export function isEmpty(str: string) {
    return str == null || str.trim().length == 0;
}