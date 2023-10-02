import './App.css'
import './ui/styles.css'

import * as Ariakit from "@ariakit/react";

import { useDeferredValue, useMemo, useState } from "react";
import { matchSorter } from "match-sorter";
import { Combobox, ComboboxItem } from "./ui/combobox-multiple.js";
import Submodule from './ui/selected-submodule.tsx';
import { LoggingRequest, State } from './model.ts'
import UiLoggingRequest from './ui/UiLoggingRequest.tsx';

import { useQuery } from 'react-query';

const arr: LoggingRequest[] = [
  {
    id: 'sdlkdfgjsd',
    rootRepository: 'swhddas',
    state: State.Waiting,
    startRef: 'sjkAAAdhd',
    endRef: 'sdkdj',
    submoduleNames: [],
  },
  {
    id: 'sdlkhjhgjsd',
    rootRepository: 'swhddas',
    state: State.Running,
    startRef: 'sjkdhd',
    endRef: 'sdkdj',
    submoduleNames: [],
  },
  {
    id: 'sdlksdfsfjsd',
    rootRepository: 'swhddas',
    state: State.Finished,
    startRef: 'sjkdhd',
    endRef: 'sdkdj',
    submoduleNames: [],
  },
  {
    id: 'sdlkjghfghsd',
    rootRepository: 'swhddas',
    state: State.Error,
    startRef: 'sjkdhd',
    endRef: 'sdkdj',
    submoduleNames: [],
    errorMessage: "Exception Occured",
    stackTrace: "kdsd jksh jasd ah \nkldjskdjd\nkldjdjsa\nlds"
  }
]

function getLoggingRequests() {

  return arr;
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


function App() {
  const [submoduleNames, setSubmoduleNames] = useState<string[]>(['dksjd', 'sds', 'sad'])
  const [value, setValue] = useState("");
  const [values, setValues] = useState<string[]>([]);
  const deferredValue = useDeferredValue(value);


  const matches = useMemo(
    () => matchSorter(submoduleNames, deferredValue),
    [deferredValue],
  );

  function onSubmoduleClick(value: string) {
    setValues(values.filter((x) => x != value))
  }





  return (
    <>
      <header className='outter-card'>
        <h1>LOGITFY - Changelog as a Service</h1>
        <h2>Select the root repository</h2>
        <div className='selection_row'>
          <input className='input' placeholder='owner/repo'></input>
          <Ariakit.Button className="button">Select Root Repository</Ariakit.Button>
        </div>
        {
          submoduleNames.length > 0 &&
          <>
            <h2>Select Submodules</h2>
            {
              values.length > 0 && <div className='row_submodules'>
                {values.map((val: string) => <Submodule key={val} name={val} onClick={onSubmoduleClick} />)}
              </div>
            }
            <div className='selection_row'>

              <Combobox
                placeholder="search submodules"
                value={value}
                onChange={setValue}
                values={values}
                onValuesChange={setValues}
              >
                {matches.map((value, i) => (
                  <ComboboxItem key={value + i} value={value} />
                ))}
                {!matches.length && <div className="no-results">No results found</div>}
              </Combobox>
            </div>
          </>
        }
        <h2> Select start (sha, tag) and end ref (sha, tag, branch)</h2>
        <div className='selection_row'>
          <input className='input' placeholder='start-ref'></input>
          &rarr;
          <input className='input' placeholder='end-ref'></input>
          <Ariakit.Button className="button"><b>Submit</b></Ariakit.Button>
        </div>
      </header >
      <LoggingRequests />


    </>
  )
}

export default App
