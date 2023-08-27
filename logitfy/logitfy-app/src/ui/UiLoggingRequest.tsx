import { FC } from 'react'
import { LoggingRequest, State } from '../model'
import './UiLoggingRequest.css'


interface Props {
    request: LoggingRequest
}

const UiLoggingRequest: FC<Props> = ({ request }) => {
    return (
        <div className='root_div'>
            <div>
                {request.rootRepository}
            </div>
            <div>|</div>
            <div>
                <code>{request.startRef}</code>
            </div>
            <div>
                &rarr;
            </div>
            <div>
                <code>{request.endRef}</code>
            </div>
            <div className='flex_one'></div>
            <div className='badge'>
                {request.state}
            </div>
        </div>
    )
}

export default UiLoggingRequest