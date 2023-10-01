import { FC, MouseEventHandler, useState } from 'react'
import { LoggingRequest, State } from '../model'
import './UiLoggingRequest.css'


interface Props {
    request: LoggingRequest
}

const UiLoggingRequest: FC<Props> = ({ request }) => {
    const [showStackTrace, setShowStackTrace] = useState<boolean>(false)

    function handleErrorMessageClick() {
        setShowStackTrace(!showStackTrace);
    }

    return (
        <>
            <div className='root_div'>
                <div className='flex-item'>
                    {request.rootRepository} | <code>{request.startRef}</code> &rarr; <code>{request.endRef}</code>
                </div>
                <div className='error_message' onClick={handleErrorMessageClick}>{request.errorMessage}</div>
                <div className={`badge ${request.state === "ERROR" ? "badge-error" : ""}`}>
                    {request.state}
                </div>
            </div >
            {
                (request.stackTrace && showStackTrace) &&
                <div>
                    <hr></hr>
                    <code className='stacktrace'>
                        {request.stackTrace}
                    </code>
                </div>
            }

        </>
    )
}

export default UiLoggingRequest