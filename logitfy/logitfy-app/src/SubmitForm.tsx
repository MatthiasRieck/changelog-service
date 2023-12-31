import React from 'react'
import { useDeferredValue, useState } from "react";
import { useQuery, QueryFunction, useQueryClient, QueryKey } from 'react-query';
import * as Ariakit from "@ariakit/react";
import { Combobox, ComboboxItem } from "./ui/combobox-multiple.js";
import { matchSorter } from "match-sorter";
import Submodule from './ui/selected-submodule.tsx';

declare const SERVER_URL: string;

const getSubmoduleNames: QueryFunction<string[], QueryKey> = async ({ queryKey }) => {
    const rootRepo = queryKey[1];

    console.log(rootRepo)

    try {
        const res = await fetch(`${SERVER_URL}/repoSubmodules/${rootRepo}`);

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        return res.json();
    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch submodules");
    }
};

function SubmitForm() {
    const queryClient = useQueryClient()

    // SECTION ROOT REPO
    const [rootRepo, setRootRepo] = useState<string>('');
    const [startRef, setStartRef] = useState<string>('');
    const [endRef, setEndRef] = useState<string>('');

    const validRootRepo = /^[a-zA-Z0-9-_]+\/[a-zA-Z0-9-_]+$/.test(rootRepo);

    const onRootRepoNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRootRepo(e.target.value);
    };
    const onStartRefChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartRef(e.target.value);
    };
    const onEndRefChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndRef(e.target.value);
    };

    const querySubmodules = useQuery<string[], Error>(
        ['submodules', rootRepo],
        getSubmoduleNames,
        {
            refetchOnWindowFocus: false,
            enabled: false,
        }
    );

    const uiSelectRootRepo = <div className="selection_row">
        <input className="input" placeholder="owner/repo" onChange={onRootRepoNameChange}></input>
        <Ariakit.Button className="button" onClick={() => querySubmodules.refetch()} disabled={!validRootRepo} >
            {rootRepo ? `Get Submodules for "${rootRepo}"` : "Specify root repo"}
        </Ariakit.Button>
    </div>

    // SECTION SUBMODULES
    const [value, setValue] = useState("");
    const [values, setValues] = useState<string[]>([]);
    const deferredValue = useDeferredValue(value);


    function onSubmoduleClick(value: string) {
        setValues(values.filter((x) => x != value))
    }

    const uiSubmodules = () => {

        if (querySubmodules.isLoading) {
            return <span> Loading...</span>;
        }

        if (querySubmodules.isError && querySubmodules.error instanceof Error) {
            return <span>Error: {querySubmodules.error.message}</span>;
        }

        console.log(querySubmodules.data)

        if (!querySubmodules.data || querySubmodules.data.length === 0) {
            return <></>
        }

        const matches = matchSorter(querySubmodules.data, deferredValue)

        return (
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
        )
    };


    const handleSubmitClick = async () => {
        const datastr = JSON.stringify({
            rootRepository: rootRepo,
            startRef: startRef,
            endRef: endRef,
            submoduleNames: values,
        })
        console.log(datastr)
        await fetch(`${SERVER_URL}/addNewRequest`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: datastr,
            });

        queryClient.invalidateQueries({ queryKey: ['requests'] });
    };


    return (
        <>
            <h1>LOGITFY - Changelog as a Service</h1>
            <h2>Select the root repository</h2>
            <p>
                Enter the root git repository using the owner, org and the repo name
                combined by a slash. In case the repo has submodules click on the button on
                the right to get the list of submodules.
            </p>
            {uiSelectRootRepo}
            {uiSubmodules()}
            <h2> Select start (sha, tag) and end ref (sha, tag, branch)</h2>
            <p>
                Enter the start and end point of the changelog. The start point can be a sha, tag, or a branch time reference.
                The end point can also be a branch name.
            </p>
            <p>
                A branch time reference is written by the branch name and a datetime in iso format separated by an '@'.
                Logitfy will find the commit that was the head of the branch at the specified time.
            </p>
            <ul>
                <li>main@2023-08-31</li>
                <li>main@2023-08-31T14:35</li>
            </ul>
            <div className='selection_row'>
                <input className='input' placeholder='start-ref' onChange={onStartRefChange}></input>
                &rarr;
                <input className='input' placeholder='end-ref' onChange={onEndRefChange}></input>
                <Ariakit.Button
                    className="button"
                    onClick={handleSubmitClick}
                    disabled={!validRootRepo || !startRef || !endRef}
                >
                    <b>Submit</b>
                </Ariakit.Button>
            </div>
        </>
    );
}

export default SubmitForm