
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from typing import List
from .model import LoggingRequest
from .worker import Worker


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


worker = Worker()

@app.get('/loggingRequests/')
def get_logging_requests() -> List[LoggingRequest]:
    return worker.requests   

@app.get('/repoSubmodules/{owner}/{repo}/')
def get_repo_submodules(owner: str, repo: str) -> List[str]:
    return ["Hello", "World", owner, repo]

@app.post('/addNewRequest/')
def add_new_request(request: LoggingRequest):

    worker.append_request(request)

