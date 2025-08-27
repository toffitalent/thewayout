import { useCallback, useId, useLayoutEffect, useRef } from 'react';
import { useControlled, useEventCallback } from '../../hooks';
export function useTabs({ defaultTab, onChange: onChangeProp, selectedTab: selectedTabProp, } = {}) {
    const idPrefix = useId();
    const tabs = useRef(new Set());
    const onChange = useEventCallback(onChangeProp);
    const [selectedTab, setSelectedTab] = useControlled({
        controlled: selectedTabProp,
        default: defaultTab,
    });
    useLayoutEffect(() => {
        if (!selectedTab && tabs.current.size) {
            setSelectedTab(Array.from(tabs.current.values())[0]);
        }
    }, [selectedTab, setSelectedTab]);
    const getTabListProps = useCallback((props = {}) => (Object.assign(Object.assign({}, props), { id: `${idPrefix}-tabs`, role: 'tablist' })), [idPrefix]);
    const getTabItemProps = useCallback((id, props = {}) => {
        const selected = selectedTab === id;
        tabs.current.add(id);
        return Object.assign(Object.assign({}, props), { id: `${idPrefix}-tabs-${id}`, role: 'tab', tabIndex: selected ? 0 : -1, 'aria-controls': `${idPrefix}-tabs-${id}-panel`, 'aria-selected': selected, onClick: (event) => {
                var _a;
                (_a = props.onClick) === null || _a === void 0 ? void 0 : _a.call(props, event);
                onChange(id);
                setSelectedTab(id);
            }, onKeyDown: (event) => {
                var _a, _b;
                (_a = props.onKeyDown) === null || _a === void 0 ? void 0 : _a.call(props, event);
                if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                    event.preventDefault();
                    const tabIds = Array.from(tabs.current.values());
                    let index = tabIds.indexOf(id) + (event.key === 'ArrowLeft' ? -1 : 1);
                    if (index < 0)
                        index += tabIds.length;
                    if (index > tabIds.length - 1)
                        index = 0;
                    onChange(tabIds[index]);
                    setSelectedTab(tabIds[index]);
                    (_b = document.getElementById(`${idPrefix}-tabs-${tabIds[index]}`)) === null || _b === void 0 ? void 0 : _b.focus();
                }
            } });
    }, [idPrefix, onChange, selectedTab, setSelectedTab]);
    const getTabPanelProps = useCallback((id, props = {}) => (Object.assign(Object.assign({}, props), { hidden: selectedTab !== id, id: `${idPrefix}-tabs-${id}-panel`, role: 'tabpanel', 'aria-labelledby': `${idPrefix}-tabs-${id}` })), [idPrefix, selectedTab]);
    return {
        getTabListProps,
        getTabItemProps,
        getTabPanelProps,
        idPrefix,
        selectedTab,
        setSelectedTab,
    };
}
