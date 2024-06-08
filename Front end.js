import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const TEST_SERVER_URLS = {
    p: 'http://20.244.56.144/test/primes',
    f: 'http://20.244.56.144/test/fibonacci',
    e: 'http://20.244.56.144/test/even',
    r: 'http://20.244.56.144/test/random'
};

const windowSize = 10;

const App = () => {
    const [numberId, setNumberId] = useState('');
    const [storedNumbers, setStoredNumbers] = useState([]);
    const [numbers, setNumbers] = useState([]);
    const [avg, setAvg] = useState(0);
    const [error, setError] = useState('');

    const fetchNumbers = async (url) => {
        try {
            const response = await axios.get(url, { timeout: 500 });
            return response.data.numbers || [];
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const calculateAverage = (nums) => {
        return nums.length ? (nums.reduce((a, b) => a + b, 0) / nums.length) : 0;
    };

    const handleFetch = async () => {
        if (!TEST_SERVER_URLS[numberId]) {
            setError('Invalid number ID');
            return;
        }

        setError('');
        const url = TEST_SERVER_URLS[numberId];
        const fetchedNumbers = await fetchNumbers(url);

        if (!fetchedNumbers.length) {
            setError('Failed to fetch numbers');
            return;
        }

        setNumbers(fetchedNumbers);

        const uniqueNumbers = [...new Set(fetchedNumbers.filter(num => !storedNumbers.includes(num)))];
        const updatedNumbers = [...storedNumbers, ...uniqueNumbers];

        if (updatedNumbers.length > windowSize) {
            updatedNumbers.splice(0, updatedNumbers.length - windowSize);
        }

        setStoredNumbers(updatedNumbers);
        setAvg(calculateAverage(updatedNumbers));
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={numberId}
                onChangeText={setNumberId}
                placeholder="Enter number ID (p, f, e, r)"
            />
            <Button title="Fetch Numbers" onPress={handleFetch} />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Text>Previous State: {JSON.stringify(storedNumbers)}</Text>
            <Text>Current State: {JSON.stringify(storedNumbers)}</Text>
            <Text>Fetched Numbers: {JSON.stringify(numbers)}</Text>
            <Text>Average: {avg.toFixed(2)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    error: {
        color: 'red',
    }
});

export default App;
