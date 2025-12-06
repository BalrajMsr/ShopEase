import React, { createContext, useContext, useState, useCallback } from 'react';
import AlertModal from '../components/AlertModal';

const AlertContext = createContext();

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};

export const AlertProvider = ({ children }) => {
    const [alertState, setAlertState] = useState({
        isOpen: false,
        message: '',
        type: 'info', // 'success', 'error', 'warning', 'info'
        title: '',
        mode: 'alert', // 'alert' | 'confirm'
        onConfirm: null,
        onCancel: null
    });

    const showAlert = useCallback((message, type = 'info', title = '') => {
        setAlertState({
            isOpen: true,
            message,
            type,
            title: title || type.charAt(0).toUpperCase() + type.slice(1),
            mode: 'alert',
            onConfirm: null,
            onCancel: null
        });
    }, []);

    const showConfirm = useCallback((message, title = 'Confirm Action') => {
        return new Promise((resolve) => {
            setAlertState({
                isOpen: true,
                message,
                type: 'warning',
                title,
                mode: 'confirm',
                onConfirm: () => {
                    resolve(true);
                    setAlertState(prev => ({ ...prev, isOpen: false }));
                },
                onCancel: () => {
                    resolve(false);
                    setAlertState(prev => ({ ...prev, isOpen: false }));
                }
            });
        });
    }, []);

    const hideAlert = useCallback(() => {
        if (alertState.mode === 'confirm' && alertState.onCancel) {
            alertState.onCancel();
        }
        setAlertState(prev => ({ ...prev, isOpen: false }));
    }, [alertState]);

    return (
        <AlertContext.Provider value={{ showAlert, showConfirm, hideAlert }}>
            {children}
            <AlertModal
                isOpen={alertState.isOpen}
                message={alertState.message}
                type={alertState.type}
                title={alertState.title}
                mode={alertState.mode}
                onConfirm={alertState.onConfirm}
                onClose={hideAlert}
            />
        </AlertContext.Provider>
    );
};
