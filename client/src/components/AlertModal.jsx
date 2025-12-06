import React, { useEffect } from 'react';

export default function AlertModal({ isOpen, message, type, title, onClose, mode, onConfirm }) {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const getTypeStyles = () => {
        switch (type) {
            case 'success':
                return {
                    icon: '✅',
                    bg: 'bg-green-50',
                    border: 'border-green-200',
                    text: 'text-green-800',
                    btn: 'bg-green-500 hover:bg-green-600 shadow-green-200'
                };
            case 'error':
                return {
                    icon: '❌',
                    bg: 'bg-red-50',
                    border: 'border-red-200',
                    text: 'text-red-800',
                    btn: 'bg-red-500 hover:bg-red-600 shadow-red-200'
                };
            case 'warning':
                return {
                    icon: '⚠️',
                    bg: 'bg-yellow-50',
                    border: 'border-yellow-200',
                    text: 'text-yellow-800',
                    btn: 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-200'
                };
            default:
                return {
                    icon: 'ℹ️',
                    bg: 'bg-blue-50',
                    border: 'border-blue-200',
                    text: 'text-blue-800',
                    btn: 'bg-blue-500 hover:bg-blue-600 shadow-blue-200'
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className={`p-6 border-b-2 ${styles.bg} ${styles.border}`}>
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{styles.icon}</span>
                        <h3 className={`text-xl font-bold ${styles.text}`}>{title}</h3>
                    </div>
                </div>

                <div className="p-8">
                    <p className="text-neutral-600 text-lg leading-relaxed">{message}</p>
                </div>

                <div className="p-6 bg-neutral-50 flex justify-end gap-4">
                    {mode === 'confirm' ? (
                        <>
                            <button
                                onClick={onClose}
                                className="px-6 py-2 rounded-xl text-neutral-600 font-semibold hover:bg-neutral-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className={`px-8 py-3 rounded-xl text-white font-bold shadow-lg transform active:scale-95 transition-all ${styles.btn}`}
                            >
                                Confirm
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={onClose}
                            className={`px-8 py-3 rounded-xl text-white font-bold shadow-lg transform active:scale-95 transition-all ${styles.btn}`}
                        >
                            Okay
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
