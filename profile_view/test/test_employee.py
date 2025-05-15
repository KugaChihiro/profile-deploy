import pytest
from httpx import AsyncClient
from api.main import app

@pytest.mark.asyncio
async def test_get_all_employees():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/employees/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
