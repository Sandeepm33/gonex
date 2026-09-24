import React, { useState } from 'react';
import { StyleSheet, View, Text, Platform, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import AppWeb from './src/App';

export default function App() {
    if (Platform.OS === 'web') {
        return <AppWeb />;
    }

    const [hasError, setHasError] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    // Determine dev server IP dynamically from Expo manifest
    const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.debuggerHost || '';
    const hostIp = hostUri ? hostUri.split(':')[0] : '10.10.222.80';

    // Priority: local network IP dev server (Vite on port 3000), fallback to public tunnel
    const targetUrl = hostIp ? `http://${hostIp}:3000` : 'https://young-moons-study.loca.lt';

    const handleRetry = () => {
        setHasError(false);
        setReloadKey(prev => prev + 1);
    };

    return (
        <View style={styles.container}>
            {hasError ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorTitle}>Unable to Connect to Dev Server</Text>
                    <Text style={styles.errorSubtext}>
                        Target: {targetUrl}
                    </Text>
                    <Text style={styles.errorHint}>
                        Make sure `npm run dev` is running on your PC and your phone is on the same Wi-Fi network.
                    </Text>
                    <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                        <Text style={styles.retryButtonText}>Retry Connection</Text>
                    </TouchableOpacity>
                </View>
            ) : (
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
                    onError={() => setHasError(true)}
                    onHttpError={() => setHasError(true)}
                    renderLoading={() => (
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>Loading GoNex App...</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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
    },
    loadingText: {
        color: '#00F0FF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorContainer: {
        flex: 1,
        backgroundColor: '#040814',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    errorTitle: {
        color: '#FF4D4D',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    errorSubtext: {
        color: '#00F0FF',
        fontSize: 14,
        marginBottom: 8,
        textAlign: 'center',
    },
    errorHint: {
        color: '#8A99AD',
        fontSize: 13,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 18,
    },
    retryButton: {
        backgroundColor: '#0129D1',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 15,
    },
});

