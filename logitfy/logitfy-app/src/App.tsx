import './App.css'
import './ui/styles.css'

import * as Ariakit from "@ariakit/react";

import { useDeferredValue, useMemo, useState } from "react";
import { matchSorter } from "match-sorter";
import { Combobox, ComboboxItem } from "./ui/combobox-multiple.js";
import Submodule from './ui/selected-submodule.tsx';
import { LoggingRequest, State } from './model.ts'
import UiLoggingRequest from './ui/UiLoggingRequest.tsx';

import LoggingRequests from './LoggingRequests.tsx';

import { useQuery } from 'react-query';

const get_submodule_names = async (rootRepo) => {
  const res = await fetch(`http://127.0.0.1:8000/repoSubmodules/${rootRepo}`)
  return res.json();
};

function App() {
  const [rootRepo, setRootRepo] = useState<string>("")
  const [submoduleNames, setSubmoduleNames] = useState<string[]>(['dksjd', 'sds', 'sad'])
  const [value, setValue] = useState("");
  const [values, setValues] = useState<string[]>([]);
  const deferredValue = useDeferredValue(value);
  const { data: availableSubmoduleData, refetch: refetchAvailableSubmoduleData } = useQuery(
    ["availableSubmodules", rootRepo],
    () => get_submodule_names(rootRepo),
    {
      enabled: false,
    }
  )

  console.log(availableSubmoduleData)


  const matches = useMemo(
    () => matchSorter(submoduleNames, deferredValue),
    [deferredValue],
  );

  function onSubmoduleClick(value: string) {
    setValues(values.filter((x) => x != value))
  }

  const onSelectRootRepoClick = () => {
    console.log('SELECT ROOT')
    refetchAvailableSubmoduleData();
  };

  const onRootRepoNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRootRepo(e.target.value);
  }

  return (
    <>
      <header className='outter-card'>
        <h1>LOGITFY - Changelog as a Service</h1>
        <h2>Select the root repository</h2>
        <div className='selection_row'>
          <input className='input' placeholder='owner/repo' onChange={onRootRepoNameChange}></input>
          <Ariakit.Button className="button" onClick={onSelectRootRepoClick}>Get Submodules for "{rootRepo}"</Ariakit.Button>
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
