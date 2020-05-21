export function setDisplayTextAndReturn(name, fn) {
    fn.displayText = name;
    return fn;
}
