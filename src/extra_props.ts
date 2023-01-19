import { version } from 'react-native/package.json';
import SemVer from 'semver';

import type { PasteInputProps, SubmitBehavior } from './types';

export function getTextInputExtraProps(props: PasteInputProps) {
    if (SemVer.gte(version, '0.70.0')) {
        return {
            submitBehavior: getSubmitBehavior(props),
        };
    }

    return {
        blurOnSubmit: getSubmitOnBlur(props),
    };
}

function getSubmitBehavior(props: PasteInputProps): SubmitBehavior | undefined {
    const multiline = props.multiline ?? false;
    let submitBehavior: SubmitBehavior | undefined;
    if (SemVer.gte(version, '0.70.0')) {
        if (props.submitBehavior != null) {
            // `submitBehavior` is set explicitly
            if (!multiline && props.submitBehavior === 'newline') {
                // For single line text inputs, `'newline'` is not a valid option
                submitBehavior = 'blurAndSubmit';
            } else {
                submitBehavior = props.submitBehavior;
            }
        } else if (multiline) {
            if (props.blurOnSubmit === true) {
                submitBehavior = 'blurAndSubmit';
            } else {
                submitBehavior = 'newline';
            }
        } else {
            // Single line
            if (props.blurOnSubmit !== false) {
                submitBehavior = 'blurAndSubmit';
            } else {
                submitBehavior = 'submit';
            }
        }
    }
    return submitBehavior;
}

function getSubmitOnBlur(
    props: PasteInputProps
): PasteInputProps['blurOnSubmit'] {
    let blurOnSubmit: PasteInputProps['blurOnSubmit'];
    const multiline = props.multiline ?? false;
    const { submitBehavior } = props;
    if (submitBehavior) {
        if (!multiline && submitBehavior === 'newline') {
            blurOnSubmit = true;
        } else if (multiline) {
            blurOnSubmit =
                submitBehavior === 'blurAndSubmit' ||
                submitBehavior === 'submit';
        }
    } else {
        blurOnSubmit = props.blurOnSubmit ?? !multiline;
    }

    return blurOnSubmit;
}
