
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from typing import List
from .model import LoggingRequest
from .worker import Worker


class App:
    def __init__(self) -> None:
        self.app = FastAPI()

        origins = [
            "http://localhost:5173",
        ]

        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

        self.worker = Worker()

        self.app.get('/loggingRequests/')(self.get_logging_requests)
        self.app.get('/repoSubmodules/{owner}/{repo}/')(self.get_repo_submodules)
        self.app.post('/addNewRequest/')(self.add_new_request)

    def get_logging_requests(self) -> List[LoggingRequest]:
        return self.worker.requests   

    def get_repo_submodules(self, owner: str, repo: str) -> List[str]:
        return ["Hello", "World", owner, repo]

    def add_new_request(self, request: LoggingRequest):
        self.worker.append_request(request)


