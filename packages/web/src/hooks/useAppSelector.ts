import { TypedUseSelectorHook, useSelector } from 'react-redux';
import type { State } from '@app/store';

export const useAppSelector: TypedUseSelectorHook<State> = useSelector;
