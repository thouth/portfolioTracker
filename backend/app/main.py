from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import protected, transactions, holdings, stock_history
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:5173",
    "https://dittdomene.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(protected.router)
app.include_router(transactions.router)
app.include_router(holdings.router)
app.include_router(stock_history.router)

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
