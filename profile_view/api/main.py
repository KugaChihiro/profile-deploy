from fastapi import FastAPI
from .schemas import Employees
from .database import get_db

app = FastAPI()

# employeesからデータを獲得
@app.get("/employees", response_model=Employees)
async def hello():
    return {"message": "hello world!"}

# employment_historyからデータを獲得
@app.get("/employment_history")

# project_infoからデータを獲得
@app.get("/project_info")

# insight_infoからデータを獲得
@app.get("/insight_info")

# skill_infoからデータを獲得
@app.get("/skill_info")

# private_infoからデータを獲得
@app.get("/private_info")

# related_infoからデータを獲得
@app.get("/related_info")

# operation_logsからデータを獲得
@app.get("/operation_logs")