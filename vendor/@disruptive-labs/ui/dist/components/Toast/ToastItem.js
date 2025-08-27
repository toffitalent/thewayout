import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import React, { useRef } from 'react';
import { Button } from '../Button';
import { CircularTimer } from '../Progress';
import { Icon } from '../Icon';
import styles from './ToastItem.module.scss';
export function ToastItem({ className, duration, isDismissed = false, onClick, text, status, }) {
    const nodeRef = useRef(null);
    return (React.createElement(CSSTransition, { nodeRef: nodeRef, in: !isDismissed, appear: true, exit: true, timeout: 300, classNames: styles },
        React.createElement("div", { ref: nodeRef, className: classNames(styles.toast, status && styles[status], className), role: "alert" },
            React.createElement("div", { className: styles.text }, text),
            React.createElement("div", { className: styles.dismiss },
                React.createElement(Button, { className: styles.button, onClick: onClick, "aria-label": "Dismiss alert" },
                    React.createElement("div", { className: styles.close },
                        React.createElement(CircularTimer, { className: styles.timer, duration: duration }),
                        React.createElement(Icon, { className: styles.icon },
                            React.createElement("path", { d: "M18 6L6 18M6 6l12 12" }))))))));
}
