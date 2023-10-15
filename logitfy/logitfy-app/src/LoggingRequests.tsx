import UiLoggingRequest from './ui/UiLoggingRequest.tsx';

import { useQuery } from 'react-query';
import { LoggingRequest } from './model.ts';

declare const SERVER_URL: string;

async function getLoggingRequests() {
    try {
        const res = await fetch(`${SERVER_URL}/loggingRequests`);

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        return res.json();
    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch logging requests");
    }
}

function LoggingRequests() {
    const query = useQuery(['requests'], getLoggingRequests, {
        refetchInterval: 10000,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: true,
    });

    if (query.isLoading) {
        return <span>Loading...</span>
    }

    if (query.isError && query.error instanceof Error) {
        return <span>Error: {query.error.message}</span>
    }
    return <div>
        {
            query.data.slice().reverse().map(
                (e: LoggingRequest) => <div className='outter-card' key={`card-${e.id}`}>
                    <UiLoggingRequest request={e} />
                </div>
            )
        }
    </div >
}
export default LoggingRequests