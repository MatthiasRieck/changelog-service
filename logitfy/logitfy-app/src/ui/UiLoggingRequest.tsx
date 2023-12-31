import { FC, useState } from 'react'
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

    let badge_class = ""

    if (request.state === State.Error) {
        badge_class = "badge-error"
    }

    if (request.state === State.Finished) {
        badge_class = "badge-success"
    }

    if (request.state === State.Running) {
        badge_class = "badge-running"
    }

    return (
        <>
            <div className='root_div'>
                <div>
                    {request.rootRepository} | <code>{request.startRef}</code> &rarr; <code>{request.endRef}</code>
                </div>
                <div className='auto-margin-left'>
                    {
                        request.jsonUri &&
                        <>
                            <span>
                                <a href={request.jsonUri}>JSON</a>
                            </span>
                            {" / "}
                        </>
                    }
                    {
                        request.htmlUri &&
                        <span>
                            <a href={request.htmlUri}>HTML</a>
                        </span>
                    }
                </div>
                {
                    request.errorMessage &&
                    <div className='error_message' onClick={handleErrorMessageClick}>{request.errorMessage}</div>
                }
                <div className={`badge ${badge_class}`}>
                    {request.state}
                </div>
            </div >
            {
                request.submoduleNames.length > 0 &&
                <div className='submodules'>
                    {request.submoduleNames.join(', ')}
                </div>
            }
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