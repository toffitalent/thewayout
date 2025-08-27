import { style } from './style';
import styles from './spacing.module.scss';
export const spacing = [
    style({
        key: ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
        prop: 'm',
        styles,
    }),
    style({
        key: ['marginRight', 'marginLeft'],
        prop: 'mh',
        styles,
    }),
    style({
        key: ['marginTop', 'marginBottom'],
        prop: 'mv',
        styles,
    }),
    style({ key: 'marginTop', prop: 'mt', styles }),
    style({ key: 'marginRight', prop: 'mr', styles }),
    style({ key: 'marginBottom', prop: 'mb', styles }),
    style({ key: 'marginLeft', prop: 'ml', styles }),
    style({
        key: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
        prop: 'p',
        styles,
    }),
    style({
        key: ['paddingRight', 'paddingLeft'],
        prop: 'ph',
        styles,
    }),
    style({
        key: ['paddingTop', 'paddingBottom'],
        prop: 'pv',
        styles,
    }),
    style({ key: 'paddingTop', prop: 'pt', styles }),
    style({ key: 'paddingRight', prop: 'pr', styles }),
    style({ key: 'paddingBottom', prop: 'pb', styles }),
    style({ key: 'paddingLeft', prop: 'pl', styles }),
];
