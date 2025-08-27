import Link from 'next/link';
import React from 'react';
import { ButtonBaseProps } from '../components';
export type ButtonLinkProps = Omit<ButtonBaseProps<typeof Link>, 'as'>;
export declare function ButtonLink(props: ButtonLinkProps): React.JSX.Element;
