// eslint-disable-next-line import/no-extraneous-dependencies
import Link from 'next/link';
import React from 'react';
import { ButtonBase } from '../components';
export function ButtonLink(props) {
    return React.createElement(ButtonBase, Object.assign({}, props, { as: Link }));
}
