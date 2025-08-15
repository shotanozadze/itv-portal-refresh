import React, { useEffect } from 'react';
import ForgeReconciler, { Text } from '@forge/react';
import { invoke, router, view } from '@forge/bridge';

const App = () => {
    const lastUpdated = React.useRef(undefined);

    useEffect(() => {
        const startPolling = async () => {
            const context = await view.getContext();
            const issueKey = context.extension?.request?.key;

            if (!issueKey) return;
            lastUpdated.current = await invoke('getIssueUpdated', { issueKey });

            const intervalId = setInterval(async () => {
                try {
                    const updated = await invoke('getIssueUpdated', { issueKey });
                    if (updated !== lastUpdated.current) {
                        await router.reload();
                    }
                } catch (err) {
                    console.error('Error checking comments:', err);
                }
            }, 5000);

            return () => clearInterval(intervalId);
        };

        const cleanup = startPolling();
        return () => {
            if (cleanup instanceof Function) cleanup();
        };
    }, []);

    return <Text></Text>;
};

ForgeReconciler.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
