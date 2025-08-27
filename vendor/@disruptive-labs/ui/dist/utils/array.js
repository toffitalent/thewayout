export function addItem(array, item) {
    return [...array, item];
}
export function removeItem(array, item) {
    return array.filter((eachItem) => eachItem !== item);
}
