import React from 'react'
import UiLoggingRequest from './ui/UiLoggingRequest.tsx';

import { useQuery } from 'react-query';

async function getLoggingRequests() {
    const res = await fetch("http://127.0.0.1:8000/loggingRequests")

    return res.json();
}

function LoggingRequests() {
    const { isLoading, isError, data, error: str } = useQuery(['requests'], getLoggingRequests);

    if (isLoading) {
        return <span>Loading...</span>
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }

    console.log(data)

    return <div>
        {
            data.map((e) => <div className='outter-card' key={`card-${e.id}`}><UiLoggingRequest request={e} /></div>)
        }
    </div >
}
export default LoggingRequests