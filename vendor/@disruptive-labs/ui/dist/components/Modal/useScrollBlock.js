import css from 'dom-helpers/css';
import getScrollbarSize from 'dom-helpers/scrollbarSize';
import { useEffect } from 'react';
export const useScrollBlock = (className, enabled = true) => {
    useEffect(() => {
        if (!enabled)
            return undefined;
        let style = {};
        try {
            style = {
                overflow: document.body.style.overflow,
                paddingRight: document.body.style.paddingRight,
            };
            const isOverflowing = document.body.scrollHeight > document.body.clientHeight;
            css(document.body, {
                overflow: 'hidden',
                paddingRight: isOverflowing
                    ? `${parseInt(css(document.body, 'paddingRight') || '0', 10) + getScrollbarSize()}px`
                    : style.paddingRight,
            });
        }
        catch (err) {
            // Ignore
        }
        document.body.classList.add(className);
        return () => {
            document.body.classList.remove(className);
            try {
                css(document.body, style);
            }
            catch (err) {
                // Ignore
            }
        };
    }, [className, enabled]);
};
