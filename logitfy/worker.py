from .model import State, LoggingRequest
from threading import Thread    

import time

class Worker:
    def __init__(self) -> None:
        self.queue_requests = []
        self.done_requests = []
        self.current_request = None

        self.queue_worker = None


    @property
    def requests(self):
        arr = []
        arr.extend(self.done_requests)
        if self.current_request:
            arr.append(self.current_request)

        arr.extend(self.queue_requests)

        return arr


    def _run_queue(self):
        while self.queue_requests:
            self.current_request = self.queue_requests.pop(0)

            # TODO: Validate request
            self.current_request.state = State.Running

            # TODO: Run request
            print(f'Running request {self.current_request.id}')
            time.sleep(10)
            print(f'Finished request {self.current_request.id}')

            # TODO: Use Callback to upload changelog

            self.current_request.state = State.Finished
            self.done_requests.append(self.current_request)
            self.current_request = None
        
        self.queue_worker = None


    def append_request(self, request: LoggingRequest):
        self.queue_requests.append(request)

        if not self.queue_worker:
            self.queue_worker = Thread(target=self._run_queue)
            self.queue_worker.start()
