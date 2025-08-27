import { style } from './style';
import styles from './borders.module.scss';
export const borders = [
    style({
        key: ['borderTop', 'borderRight', 'borderBottom', 'borderLeft'],
        prop: 'border',
        styles,
    }),
    style({ prop: 'borderTop', styles }),
    style({ prop: 'borderRight', styles }),
    style({ prop: 'borderBottom', styles }),
    style({ prop: 'borderLeft', styles }),
    style({ prop: 'borderColor', styles }),
    style({ prop: 'borderWidth', styles }),
    style({ prop: 'rounded', styles }),
];
