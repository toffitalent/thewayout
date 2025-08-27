import React from 'react';
export declare const TabContext: React.Context<{
    getTabListProps: <T extends HTMLElement>(props?: React.HTMLProps<T>) => React.HTMLProps<T>;
    getTabItemProps: <T_1 extends HTMLElement>(id: string, props?: React.HTMLProps<T_1>) => React.HTMLProps<T_1>;
    getTabPanelProps: <T_2 extends HTMLElement>(id: string, props?: React.HTMLProps<T_2>) => React.HTMLProps<T_2>;
    idPrefix: string;
    selectedTab: string;
    setSelectedTab: (newValue: string | ((prevValue: string) => string)) => void;
}>;
export declare function useTabContext(): {
    getTabListProps: <T extends HTMLElement>(props?: React.HTMLProps<T>) => React.HTMLProps<T>;
    getTabItemProps: <T_1 extends HTMLElement>(id: string, props?: React.HTMLProps<T_1>) => React.HTMLProps<T_1>;
    getTabPanelProps: <T_2 extends HTMLElement>(id: string, props?: React.HTMLProps<T_2>) => React.HTMLProps<T_2>;
    idPrefix: string;
    selectedTab: string;
    setSelectedTab: (newValue: string | ((prevValue: string) => string)) => void;
};
