import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Platform,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    SafeAreaView,
    ScrollView
} from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import AppWeb from './src/App';

export default function App() {
    if (Platform.OS === 'web') {
        return <AppWeb />;
    }

    // Determine dev server host dynamically from Expo manifest
    const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.debuggerHost || '';

    // Check if hostUri contains a standard IPv4 address
    const ipMatch = hostUri.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
    const detectedIp = ipMatch ? ipMatch[1] : '10.10.222.80';
    const defaultUrl = `http://${detectedIp}:3000`;

    const [targetUrl, setTargetUrl] = useState<string>(defaultUrl);
    const [customInput, setCustomInput] = useState<string>(defaultUrl);
    const [hasError, setHasError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [reloadKey, setReloadKey] = useState<number>(0);

    const isTunnelActive = hostUri.includes('exp.direct') || hostUri.includes('ngrok') || hostUri.includes('loca.lt');

    // 7-second safety timeout for WebView loading state
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isLoading && !hasError) {
            timer = setTimeout(() => {
                setHasError(true);
                setIsLoading(false);
                setErrorMessage(
                    isTunnelActive
                        ? `Expo Tunnel detected (${hostUri}). Vite web server on port 3000 is not automatically tunneled by Expo. Please enter your local IP (e.g. http://${detectedIp}:3000) or public tunnel URL below.`
                        : `Could not reach ${targetUrl} within 7 seconds. Please verify Vite dev server ('npm run dev') is running.`
                );
            }, 7000);
        }
        return () => clearTimeout(timer);
    }, [isLoading, reloadKey, targetUrl, hasError, isTunnelActive, hostUri, detectedIp]);

    const handleConnect = (urlToConnect?: string) => {
        const url = (urlToConnect || customInput).trim();
        let formattedUrl = url;
        if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
            formattedUrl = `http://${formattedUrl}`;
        }
        setTargetUrl(formattedUrl);
        setCustomInput(formattedUrl);
        setHasError(false);
        setIsLoading(true);
        setErrorMessage('');
        setReloadKey(prev => prev + 1);
    };

    return (
        <SafeAreaView style={styles.container}>
            {hasError ? (
                <ScrollView contentContainerStyle={styles.errorScrollContainer} keyboardShouldPersistTaps="handled">
                    <View style={styles.errorCard}>
                        <Text style={styles.errorBadge}>
                            {isTunnelActive ? 'TUNNEL MODE DETECTED' : 'CONNECTION TIMEOUT'}
                        </Text>
                        <Text style={styles.errorTitle}>Dev Server Unreachable</Text>

                        <Text style={styles.errorHint}>
                            {errorMessage || `Unable to load app from: ${targetUrl}`}
                        </Text>

                        <View style={styles.inputSection}>
                            <Text style={styles.inputLabel}>Enter Dev Server / Tunnel URL:</Text>
                            <TextInput
                                style={styles.input}
                                value={customInput}
                                onChangeText={setCustomInput}
                                placeholder="http://192.168.x.x:3000"
                                placeholderTextColor="#4A5568"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        <View style={styles.presetsContainer}>
                            <Text style={styles.presetsTitle}>Quick Presets:</Text>
                            <TouchableOpacity
                                style={styles.presetButton}
                                onPress={() => handleConnect(`http://${detectedIp}:3000`)}
                            >
                                <Text style={styles.presetButtonText}>Local IP: http://{detectedIp}:3000</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.presetButton}
                                onPress={() => handleConnect('http://localhost:3000')}
                            >
                                <Text style={styles.presetButtonText}>Localhost: http://localhost:3000</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.connectButton} onPress={() => handleConnect()}>
                            <Text style={styles.connectButtonText}>Connect & Retry</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            ) : (
                <View style={styles.webviewContainer}>
                    <WebView
                        key={reloadKey}
                        source={{ uri: targetUrl }}
                        style={styles.webview}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        startInLoadingState={true}
                        scalesPageToFit={true}
                        allowsInlineMediaPlayback={true}
                        mediaPlaybackRequiresUserAction={false}
                        onLoadStart={() => setIsLoading(true)}
                        onLoadEnd={() => setIsLoading(false)}
                        onError={(syntheticEvent) => {
                            const { nativeEvent } = syntheticEvent;
                            setHasError(true);
                            setIsLoading(false);
                            setErrorMessage(`Failed to load URL: ${nativeEvent.description || targetUrl}`);
                        }}
                        onHttpError={(syntheticEvent) => {
                            const { nativeEvent } = syntheticEvent;
                            setHasError(true);
                            setIsLoading(false);
                            setErrorMessage(`HTTP Error ${nativeEvent.statusCode} from ${targetUrl}`);
                        }}
                        renderLoading={() => (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#00F0FF" />
                                <Text style={styles.loadingText}>Loading GoNex App...</Text>
                                <Text style={styles.loadingSubtext}>{targetUrl}</Text>
                            </View>
                        )}
                    />
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#040814',
    },
    webviewContainer: {
        flex: 1,
        backgroundColor: '#040814',
    },
    webview: {
        flex: 1,
        backgroundColor: '#040814',
    },
    loadingContainer: {
        ...StyleSheet.absoluteFill,
        backgroundColor: '#040814',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    loadingText: {
        color: '#00F0FF',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
    },
    loadingSubtext: {
        color: '#64748B',
        fontSize: 12,
        marginTop: 8,
        textAlign: 'center',
    },
    errorScrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#040814',
    },
    errorCard: {
        backgroundColor: '#0B132B',
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: '#00F0FF33',
        alignItems: 'stretch',
    },
    errorBadge: {
        color: '#FFB800',
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 1.5,
        textAlign: 'center',
        marginBottom: 8,
    },
    errorTitle: {
        color: '#FF4D4D',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
    },
    errorHint: {
        color: '#94A3B8',
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
    inputSection: {
        marginBottom: 16,
    },
    inputLabel: {
        color: '#00F0FF',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#1C2541',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        color: '#FFFFFF',
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#3A506B',
    },
    presetsContainer: {
        marginBottom: 20,
    },
    presetsTitle: {
        color: '#64748B',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 8,
    },
    presetButton: {
        backgroundColor: '#1C254188',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#00F0FF22',
    },
    presetButtonText: {
        color: '#00F0FF',
        fontSize: 13,
        fontWeight: '500',
    },
    connectButton: {
        backgroundColor: '#0221bf',
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
        shadowColor: '#00F0FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    connectButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});


