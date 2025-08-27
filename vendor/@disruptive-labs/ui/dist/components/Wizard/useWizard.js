var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useCallback, useEffect, useReducer, useRef } from 'react';
import { useEventCallback } from '../../hooks';
var WizardActionType;
(function (WizardActionType) {
    WizardActionType[WizardActionType["GOTO"] = 0] = "GOTO";
    WizardActionType[WizardActionType["NEXT"] = 1] = "NEXT";
    WizardActionType[WizardActionType["PREVIOUS"] = 2] = "PREVIOUS";
    WizardActionType[WizardActionType["RESET"] = 3] = "RESET";
})(WizardActionType || (WizardActionType = {}));
function reducer(state, action) {
    switch (action.type) {
        case WizardActionType.GOTO:
        case WizardActionType.NEXT:
            return {
                currentStepIndex: action.index,
                path: [...state.path, state.currentStepIndex],
            };
        case WizardActionType.PREVIOUS:
            if (state.path.length) {
                return {
                    currentStepIndex: state.path[state.path.length - 1],
                    path: state.path.slice(0, -1),
                };
            }
            return state;
        case WizardActionType.RESET:
            return {
                currentStepIndex: action.index,
                path: [],
            };
        /* istanbul ignore next */
        default:
            return state;
    }
}
const defaultProcessStep = (data) => data;
export function useWizard({ initialData, initialStepIndex = 0, onStepChange: onStepChangeProp, showBackButton = false, steps: wizardSteps, }) {
    var _a;
    const [{ currentStepIndex }, dispatch] = useReducer(reducer, {
        currentStepIndex: initialStepIndex,
        path: [],
    });
    const data = useRef(initialData !== null && initialData !== void 0 ? initialData : {});
    const steps = useRef(wizardSteps);
    const step = steps.current[currentStepIndex];
    const [, forceUpdate] = useReducer((x) => x + 1, 0);
    const onStepChange = useEventCallback(onStepChangeProp);
    const processStep = useEventCallback((_a = step.processStep) !== null && _a !== void 0 ? _a : defaultProcessStep);
    const getNextStep = useEventCallback(() => typeof step.nextStep === 'function' ? step.nextStep(data.current) : step.nextStep);
    useEffect(() => {
        steps.current = wizardSteps;
    }, [wizardSteps]);
    useEffect(() => {
        onStepChange === null || onStepChange === void 0 ? void 0 : onStepChange(step, data.current);
    }, [onStepChange, step]);
    const setData = useCallback((stepData, update = true) => __awaiter(this, void 0, void 0, function* () {
        data.current = Object.assign(Object.assign({}, data.current), (yield processStep(stepData)));
        if (update)
            forceUpdate();
        return data.current;
    }), [processStep]);
    const goTo = useCallback((stepIdOrIndex) => {
        if (typeof stepIdOrIndex === 'number') {
            dispatch({ type: WizardActionType.GOTO, index: stepIdOrIndex });
        }
        else {
            const index = steps.current.findIndex(({ id }) => id === stepIdOrIndex);
            if (index >= 0)
                dispatch({ type: WizardActionType.GOTO, index });
        }
    }, []);
    const next = useCallback((stepData) => __awaiter(this, void 0, void 0, function* () {
        if (stepData && !stepData.nativeEvent)
            yield setData(stepData, false);
        const nextStep = yield getNextStep();
        if (nextStep) {
            goTo(nextStep);
        }
        else {
            const index = currentStepIndex + 1;
            if (steps.current[index])
                dispatch({ type: WizardActionType.NEXT, index });
        }
    }), [currentStepIndex, getNextStep, goTo, setData]);
    const previous = useCallback(() => {
        dispatch({ type: WizardActionType.PREVIOUS });
    }, []);
    const reset = useCallback(() => {
        data.current = initialData !== null && initialData !== void 0 ? initialData : {};
        dispatch({ type: WizardActionType.RESET, index: initialStepIndex });
    }, [initialData, initialStepIndex]);
    return {
        currentStepIndex,
        currentStepId: step.id,
        data: data.current,
        isFirst: currentStepIndex === 0,
        isLast: currentStepIndex === steps.current.length - 1,
        length: steps.current.length,
        progress: currentStepIndex / steps.current.length,
        showBackButton,
        goTo,
        next,
        previous,
        reset,
        setData,
    };
}
