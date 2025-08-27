import arrowModifier from '@popperjs/core/lib/modifiers/arrow';
import computeStyles from '@popperjs/core/lib/modifiers/computeStyles';
import eventListeners from '@popperjs/core/lib/modifiers/eventListeners';
import flip from '@popperjs/core/lib/modifiers/flip';
import hide from '@popperjs/core/lib/modifiers/hide';
import offset from '@popperjs/core/lib/modifiers/offset';
import popperOffsets from '@popperjs/core/lib/modifiers/popperOffsets';
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow';
import { popperGenerator } from '@popperjs/core/lib/popper-base';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCallbackRef } from '../../hooks';
import { mergeRefs } from '../../utils';
const createPopper = popperGenerator({
    defaultModifiers: [
        hide,
        popperOffsets,
        computeStyles,
        eventListeners,
        offset,
        flip,
        preventOverflow,
        arrowModifier,
    ],
});
const matchWidthModifier = {
    name: 'matchWidth',
    enabled: true,
    phase: 'beforeWrite',
    requires: ['computeStyles'],
    fn: ({ state }) => {
        // eslint-disable-next-line no-param-reassign
        state.styles.popper.width = `${state.rects.reference.width}px`;
    },
    effect: ({ state }) => () => {
        const reference = state.elements.reference;
        // eslint-disable-next-line no-param-reassign
        state.elements.popper.style.width = `${reference.offsetWidth}px`;
    },
};
const getInitialPopperState = (position) => ({
    attributes: {},
    styles: {
        popper: {
            position,
            top: '0',
            left: '0',
            opacity: '0',
            pointerEvents: 'none',
        },
        arrow: {
            position: 'absolute',
        },
    },
});
/**
 * `usePopper` is a React hook for initializing a Popper.js instance. The returned functions can be
 * use to wire up elements for Popper-based positioning of the elements relative to some reference
 * element.
 */
export const usePopper = ({ boundary = 'clippingParents', flip: flipProp = true, gutter, matchWidth, modifiers, offset: offsetProp, placement: placementProp = 'bottom', preventOverflow: preventOverflowProp = true, strategy = 'absolute', } = {}) => {
    var _a, _b;
    const [arrow, arrowRef] = useCallbackRef();
    const [popper, popperRef] = useCallbackRef();
    const [reference, referenceRef] = useCallbackRef();
    const instance = useRef();
    const cleanup = useRef();
    const [popperState, setPopperState] = useState(getInitialPopperState(strategy));
    const updateStateModifier = useMemo(() => ({
        name: 'updateState',
        enabled: true,
        phase: 'write',
        fn: ({ state }) => {
            const elements = Object.keys(state.elements);
            setPopperState({
                attributes: elements.reduce((attributes, element) => (Object.assign(Object.assign({}, attributes), { [element]: state.attributes[element] })), {}),
                styles: elements.reduce((styles, element) => (Object.assign(Object.assign({}, styles), { [element]: state.styles[element] || {} })), {}),
            });
        },
        requires: ['computeStyles'],
    }), []);
    const initializePopper = useCallback(() => {
        var _a;
        if (!reference || !popper)
            return;
        // Clean up existing popper instances, if any
        (_a = cleanup.current) === null || _a === void 0 ? void 0 : _a.call(cleanup);
        instance.current = createPopper(reference, popper, {
            placement: placementProp,
            modifiers: [
                Object.assign(Object.assign({}, matchWidthModifier), { enabled: !!matchWidth }),
                {
                    name: 'arrow',
                    enabled: !!arrow,
                    options: { element: arrow },
                },
                {
                    name: 'offset',
                    options: {
                        offset: offsetProp !== null && offsetProp !== void 0 ? offsetProp : [0, gutter],
                    },
                },
                {
                    name: 'flip',
                    enabled: !!flipProp,
                    options: {},
                },
                {
                    name: 'preventOverflow',
                    enabled: !!preventOverflowProp,
                    options: { boundary },
                },
                updateStateModifier,
                ...(modifiers || []),
            ],
            strategy,
        });
        instance.current.forceUpdate();
        cleanup.current = instance.current.destroy;
    }, [
        arrow,
        boundary,
        flipProp,
        gutter,
        matchWidth,
        modifiers,
        offsetProp,
        placementProp,
        preventOverflowProp,
        popper,
        reference,
        strategy,
        updateStateModifier,
    ]);
    useEffect(() => {
        initializePopper();
        return () => {
            var _a;
            if (!reference && !popper) {
                (_a = instance.current) === null || _a === void 0 ? void 0 : _a.destroy();
                instance.current = undefined;
                setPopperState(getInitialPopperState('absolute'));
            }
        };
    }, [initializePopper, popper, reference]);
    const getArrowProps = useCallback((props = {}, ref = null) => (Object.assign(Object.assign(Object.assign({}, popperState.attributes.arrow), props), { ref: mergeRefs(arrowRef, ref), 'data-popper-arrow': '', style: Object.assign(Object.assign({ willChange: 'transform' }, props.style), popperState.styles.arrow) })), [arrowRef, popperState]);
    const getPopperProps = useCallback((props = {}, ref = null) => (Object.assign(Object.assign(Object.assign({}, popperState.attributes.popper), props), { ref: mergeRefs(popperRef, ref), style: Object.assign(Object.assign(Object.assign({}, props.style), popperState.styles.popper), { position: strategy, minWidth: matchWidth ? undefined : 'max-content', willChange: 'transform, visibility' }) })), [matchWidth, popperRef, popperState, strategy]);
    const getReferenceProps = useCallback((props = {}, ref = null) => (Object.assign(Object.assign({}, props), { ref: mergeRefs(referenceRef, ref) })), [referenceRef]);
    return {
        update: (_a = instance.current) === null || _a === void 0 ? void 0 : _a.update,
        forceUpdate: (_b = instance.current) === null || _b === void 0 ? void 0 : _b.forceUpdate,
        popperRef,
        referenceRef,
        getArrowProps,
        getPopperProps,
        getReferenceProps,
    };
};
