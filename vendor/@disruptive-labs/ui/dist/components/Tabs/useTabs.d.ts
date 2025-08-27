/// <reference types="react" />
export interface UseTabsProps {
    /**
     * ID value of the tab to display initially (default to first Tab element).
     */
    defaultTab?: string;
    /**
     * Callback fired when selected tab changes.
     */
    onChange?: (value: string) => void;
    /**
     * ID value of the selected tab for controlled mode.
     */
    selectedTab?: string;
}
export declare function useTabs({ defaultTab, onChange: onChangeProp, selectedTab: selectedTabProp, }?: UseTabsProps): {
    getTabListProps: <T extends HTMLElement>(props?: import("react").HTMLProps<T>) => import("react").HTMLProps<T>;
    getTabItemProps: <T_1 extends HTMLElement>(id: string, props?: import("react").HTMLProps<T_1>) => import("react").HTMLProps<T_1>;
    getTabPanelProps: <T_2 extends HTMLElement>(id: string, props?: import("react").HTMLProps<T_2>) => import("react").HTMLProps<T_2>;
    idPrefix: string;
    selectedTab: string;
    setSelectedTab: (newValue: string | ((prevValue: string) => string)) => void;
};
export type UseTabsReturnValue = ReturnType<typeof useTabs>;
