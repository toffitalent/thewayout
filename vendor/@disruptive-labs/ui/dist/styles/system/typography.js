import { style } from './style';
import styles from './typography.module.scss';
export const typography = [
    style({ key: 'font', prop: 'f', styles }),
    style({ prop: 'fontSize', styles }),
    style({ prop: 'fontWeight', styles }),
    style({ prop: 'lineHeight', styles }),
    style({ prop: 'textAlign', styles }),
    style({ prop: 'textDecoration', styles }),
    style({ prop: 'textTransform', styles }),
    style({ prop: 'whiteSpace', styles }),
];
