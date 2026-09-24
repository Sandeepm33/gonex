import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { RideProvider, useRide } from './context/RideContext';
import { MobileFrameWrapper } from './components/MobileFrameWrapper';
import { Sidebar } from './components/Sidebar';

import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen, OTPVerificationScreen } from './screens/RegisterScreen';
import { ForgotPasswordScreen } from './screens/ForgotPasswordScreen';
import { HomeScreen } from './screens/HomeScreen';
import { LocationSearchScreen } from './screens/LocationSearchScreen';
import { RoutePreviewScreen, RideSelectionScreen } from './screens/RoutePreviewScreen';
import { ConfirmRideScreen } from './screens/ConfirmRideScreen';
import { SearchingDriverScreen } from './screens/SearchingDriverScreen';
import { ActiveRideScreen } from './screens/ActiveRideScreen';
import { RideCompletedScreen } from './screens/RideCompletedScreen';
import { MyRidesScreen } from './screens/MyRidesScreen';
import { PaymentMethodsScreen } from './screens/PaymentMethodsScreen';
import { ProfileScreen, NotificationsScreen } from './screens/ProfileScreen';
import { SettingsScreen, HelpScreen, TermsScreen } from './screens/SettingsScreen';

const MainScreenRouter: React.FC = () => {
    const { currentScreen } = useRide();

    switch (currentScreen) {
        case 'splash':
            return <SplashScreen />;
        case 'onboarding':
            return <OnboardingScreen />;
        case 'login':
            return <LoginScreen />;
        case 'register':
            return <RegisterScreen />;
        case 'otp':
            return <OTPVerificationScreen />;
        case 'forgot-password':
            return <ForgotPasswordScreen />;
        case 'home':
            return <HomeScreen />;
        case 'location-search':
            return <LocationSearchScreen />;
        case 'route-preview':
            return <RoutePreviewScreen />;
        case 'ride-selection':
            return <RideSelectionScreen />;
        case 'confirm-ride':
            return <ConfirmRideScreen />;
        case 'searching-driver':
            return <SearchingDriverScreen />;
        case 'active-ride':
            return <ActiveRideScreen />;
        case 'ride-completed':
            return <RideCompletedScreen />;
        case 'my-rides':
        case 'ride-history':
            return <MyRidesScreen />;
        case 'payment-methods':
            return <PaymentMethodsScreen />;
        case 'notifications':
            return <NotificationsScreen />;
        case 'profile':
            return <ProfileScreen />;
        case 'settings':
            return <SettingsScreen />;
        case 'help':
            return <HelpScreen />;
        case 'terms':
            return <TermsScreen />;
        default:
            return <HomeScreen />;
    }
};

export function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <RideProvider>
                    <MobileFrameWrapper>
                        <Sidebar />
                        <MainScreenRouter />
                    </MobileFrameWrapper>
                </RideProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
