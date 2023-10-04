import './App.css'
import './ui/styles.css'

import LoggingRequests from './LoggingRequests.tsx';
import SubmitForm from './SubmitForm.tsx';

function App() {
  return (
    <>
      <header className='outter-card'>
        <SubmitForm />
      </header>
      <LoggingRequests />
    </>
  )
}

export default App
