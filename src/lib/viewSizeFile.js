export default function viewSizeFile(size) {
    if (size >= 1024 * 1024) {
        return `${(size / 1000 / 1000).toFixed(1)} МБ`
    }
    if (size >= 1024) {
        return `${(size / 1000).toFixed(0)} КБ`
    }
    return `${(size)}Байт`
}