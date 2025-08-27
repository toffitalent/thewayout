var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { useCallback } from 'react';
import { Box } from '../Box';
import { classNames } from '../../utils';
import { useTabs } from './useTabs';
import { TabContext, useTabContext } from './TabContext';
import styles from './Tabs.module.scss';
import { Select } from '../Select';
/**
 * Tabs is an accessible tab-based layout implementation that renders content based on the selected
 * tab and falls back to a more-manageable Select component on mobile by default.
 */
export const Tabs = (_a) => {
    var { children } = _a, props = __rest(_a, ["children"]);
    const context = useTabs(props);
    return React.createElement(TabContext.Provider, { value: context }, children);
};
/**
 * TabList wraps the actual list of tabs and applies accessibility-related props. By default, it
 * will fall back to a Select component on mobile to avoid/minimize tabs wrapping.
 */
export const TabList = React.forwardRef((_a, ref) => {
    var { children, className, showSelectOnMobile = true, variant = 'default' } = _a, props = __rest(_a, ["children", "className", "showSelectOnMobile", "variant"]);
    const { getTabListProps, setSelectedTab } = useTabContext();
    const onChange = useCallback((event) => {
        setSelectedTab(event.target.value);
    }, [setSelectedTab]);
    return (React.createElement(React.Fragment, null,
        React.createElement(Box, Object.assign({}, getTabListProps(props), { as: "div", className: classNames(styles.list, styles[variant], className), ref: ref }), children),
        showSelectOnMobile && (React.createElement("div", { className: styles.listSelect, "aria-hidden": "true" },
            React.createElement(Select, { fluid: true, onChange: onChange, "data-testid": "tabs-select" }, React.Children.map(children, (child) => {
                if (!React.isValidElement(child))
                    return null;
                return React.createElement("option", { value: child.props.id }, child.props.children);
            }))))));
});
/**
 * Tab represents an individual tab item and is linked to a related TabPanel component via the
 * required "id" prop. It renders an HTML button component with attached accessibility
 * attributes and handlers for changing the selected tab.
 */
export const Tab = React.forwardRef((_a, ref) => {
    var { children, className, icon, id } = _a, props = __rest(_a, ["children", "className", "icon", "id"]);
    const { getTabItemProps, selectedTab } = useTabContext();
    return (React.createElement(Box, Object.assign({}, getTabItemProps(id, props), { as: "button", className: classNames(styles.item, selectedTab === id && styles.itemActive, className), type: "button", ref: ref }),
        icon && (React.createElement("span", { className: styles.icon, "aria-hidden": "true" }, icon)),
        children));
});
/**
 * TabPanel wraps the content of a specific tab and is linked to a related Tab component by the
 * required "id" prop.
 *
 * Note: Only the content of the selected tab will be rendered currently, meaning that state will
 * be lost as components unmount and remounted when changing tabs.
 */
export const TabPanel = React.forwardRef((_a, ref) => {
    var { children, id } = _a, props = __rest(_a, ["children", "id"]);
    const { getTabPanelProps, selectedTab } = useTabContext();
    return (React.createElement(Box, Object.assign({}, getTabPanelProps(id, props), { ref: ref }), id === selectedTab && children));
});
