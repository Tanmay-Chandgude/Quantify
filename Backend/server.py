from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import requests

load_dotenv()

app = FastAPI()

# CORS Configuration
origins = [
    "http://localhost:3000",  # Frontend address
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Configuration
BASE_API_URL = "https://api.langflow.astra.datastax.com"
LANGFLOW_ID = "96f512a1-d07a-4283-9ecb-9478d59364d9"
FLOW_ID = "173e5667-4185-4a96-8516-b5b89a1be66b"
APPLICATION_TOKEN = os.environ.get("APPLICATION_TOKEN")
ENDPOINT = "quantify"

class Message(BaseModel):
    message: str

def run_flow(message: str) -> dict:
    api_url = f"{BASE_API_URL}/lf/{LANGFLOW_ID}/api/v1/run/{ENDPOINT}"

    payload = {
        "input_value": message,
        "output_type": "chat",
        "input_type": "chat",
    }

    headers = {"Authorization": f"Bearer {APPLICATION_TOKEN}", "Content-Type": "application/json"}
    response = requests.post(api_url, json=payload, headers=headers)

    if response.status_code != 200:
        raise Exception(f"Error: {response.status_code}, {response.text}")
    
    return response.json()

@app.post("/run_flow")
async def handle_run_flow(message: Message):
    if not message.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    try:
        response = run_flow(message.message)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
