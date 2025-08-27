const hasTabIndex = (element) => element.hasAttribute('tabindex');
const isContentEditable = (element) => {
    const value = element.getAttribute('contenteditable');
    return value !== 'false' && value != null;
};
const isDisabled = (element) => Boolean(element.getAttribute('disabled')) === true ||
    Boolean(element.getAttribute('aria-disabled')) === true;
const isHidden = (element) => {
    if (element.parentElement && isHidden(element.parentElement))
        return true;
    return element.hidden;
};
const isHTMLElement = (element) => element instanceof HTMLElement;
const isFocusable = (element) => {
    if (!isHTMLElement(element) || isHidden(element) || isDisabled(element)) {
        return false;
    }
    const { localName } = element;
    const focusableTags = ['input', 'select', 'textarea', 'button'];
    if (focusableTags.indexOf(localName) >= 0)
        return true;
    const others = {
        a: () => element.hasAttribute('href'),
        audio: () => element.hasAttribute('controls'),
        video: () => element.hasAttribute('controls'),
    };
    if (localName in others) {
        return others[localName]();
    }
    if (isContentEditable(element))
        return true;
    return hasTabIndex(element);
};
const focusableElList = [
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'embed',
    'iframe',
    'object',
    'a[href]',
    'area[href]',
    'button:not([disabled])',
    '[tabindex]',
    'audio[controls]',
    'video[controls]',
    '*[tabindex]:not([aria-disabled])',
    '*[contenteditable]',
];
const focusableElSelector = focusableElList.join();
export const getAllFocusable = (container) => [container, ...Array.from(container.querySelectorAll(focusableElSelector))]
    .filter(isFocusable)
    .filter((el) => window.getComputedStyle(el).display !== 'none');
