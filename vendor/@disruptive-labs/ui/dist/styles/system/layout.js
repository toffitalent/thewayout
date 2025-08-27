import { style } from './style';
import styles from './layout.module.scss';
export const layout = [
    style({ prop: 'display', styles }),
    style({ prop: 'overflow', styles }),
    style({ prop: 'visibility', styles }),
    style({ prop: 'width', styles }),
    style({ prop: 'height', styles }),
    style({ prop: 'maxWidth', styles }),
    style({ prop: 'maxHeight', styles }),
    style({ prop: 'minWidth', styles }),
    style({ prop: 'minHeight', styles }),
];
