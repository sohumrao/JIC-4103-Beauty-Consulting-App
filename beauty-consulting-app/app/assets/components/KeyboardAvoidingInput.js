import React from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Platform,
    View,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';

// TODO: fix visual bug with top part being very difficult to see
const KeyboardAvoidingInput = ({ children }) => {
    const headerHeight = useHeaderHeight();
    return (
        <KeyboardAvoidingView
            behavior={Platform.select({android: undefined, ios: 'padding'})}
            keyboardVerticalOffset={headerHeight}
        >
            <ScrollView>
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
        
    );
};

export default KeyboardAvoidingInput;