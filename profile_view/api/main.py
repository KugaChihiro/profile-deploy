from fastapi import FastAPI
from api.routers import employee
from api.routers import employment_history
from api.routers import project_info
from api.routers import insight_info
from api.routers import skill_info
from api.routers import private_info
from api.routers import related_info
from api.routers import operation_logs
from api.routers import storage

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","https://gray-pebble-0ebec3900.6.azurestaticapps.net"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employee.router)
app.include_router(employment_history.router)
app.include_router(project_info.router)
app.include_router(insight_info.router)
app.include_router(skill_info.router)
app.include_router(private_info.router)
app.include_router(related_info.router)
app.include_router(operation_logs.router)
app.include_router(storage.router)
