import { 
    StyleSheet, 
} from 'react-native';

const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#fff',
    },
    box: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        width: '100%', 
    },
    button: {
        backgroundColor: '#FF5252', 
        paddingVertical: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    linkText: {
        color: '#FF5252',
        textAlign: 'center',
        marginTop: 10,
    },
    inputHeaderText: {
        color: '#FF5252',
    },
    promptText: {
        textAlign: 'center',
        marginTop: 20,
    },
    stepIndicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    step: {
        flex: 1,
        height: 5,
        backgroundColor: '#eee',
        borderRadius: 2.5,
        marginHorizontal: 2,
    },
    stepCompleted: {
        backgroundColor: 'red',
    },
    bubbleContainer: {
        flexDirection: 'row',
        padding: 20,
        backgroundColor: '#fff',
    },
});

export default globalStyles;
