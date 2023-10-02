from typing import List, Optional
from enum import Enum

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from humps.camel import case


def to_camel(string):
    return case(string)


class State(str, Enum):
    Waiting = "WAITING"
    Running = "RUNNING"
    Finished = "FINISHED"
    Error = "ERROR"


class LoggingRequest(BaseModel):
    id: str
    root_repository: str
    submodule_names: List[str]
    start_ref: str
    end_ref: str
    json_uri: Optional[str] = None
    html_uri: Optional[str] = None
    state: State
    error_message: Optional[str] = None
    stack_trace: Optional[str] = None

    class Config:
        alias_generator = to_camel
        allow_population_by_field_name = True
        populate_by_name = True


app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



logging_requests = []


@app.get('/loggingRequests/')
def get_logging_requests() -> List[LoggingRequest]:
    return [
        LoggingRequest(
            id="myid",
            root_repository="root_repo",
            submodule_names=["sub_names"],
            start_ref="start",
            end_ref="end",
            state=State.Finished,
        )
    ]

@app.get('/repoSubmodules/{owner}/{repo}/')
def get_repo_submodules(owner: str, repo: str) -> List[str]:
    return ["Hello", "World", owner, repo]

@app.post('/addNewRequest/')
def add_new_request(request: LoggingRequest):
    logging_requests.append(request)
