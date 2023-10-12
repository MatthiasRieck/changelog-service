
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from typing import List, Callable

from gitaudit.github.instance import Github
from gitaudit.git.change_log_entry import Issue

from .model import LoggingRequest
from .worker import Worker

JsonUploadCallback = Callable[[LoggingRequest, str], str]
HtmlUploadCallback = Callable[[LoggingRequest, str], str]
CommitUrlProvider = Callable[[str, str, str], str]
IssuesProvider = Callable[[str, str], List[Issue]]


class App:
    def __init__(
            self,
            tmp_git_checkout_location: str,
            json_upload_callback: JsonUploadCallback,
            html_upload_callback: HtmlUploadCallback,
            commit_url_provider: CommitUrlProvider,
            issues_provider: IssuesProvider,
            github: Github,
        ) -> None:
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

        self.worker = Worker(
            tmp_git_checkout_location=tmp_git_checkout_location,
            json_upload_callback=json_upload_callback,
            html_upload_callback=html_upload_callback,
            commit_url_provider=commit_url_provider,
            issues_provider=issues_provider,
            github=github,
        )

        self.app.get('/loggingRequests/')(self.get_logging_requests)
        self.app.get('/repoSubmodules/{owner}/{repo}/')(self.get_repo_submodules)
        self.app.post('/addNewRequest/')(self.add_new_request)

    def get_logging_requests(self) -> List[LoggingRequest]:
        """Returns all requests"""
        return self.worker.requests   

    def get_repo_submodules(self, owner: str, repo: str) -> List[str]:
        """Returns all submodules for a repository"""
        return ["Hello", "World", owner, repo]

    def add_new_request(self, request: LoggingRequest):
        """Adds a new request to the queue"""
        self.worker.append_request(request)


