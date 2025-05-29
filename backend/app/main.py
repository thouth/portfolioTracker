from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import protected  # Beskyttet rute
import os
from dotenv import load_dotenv

load_dotenv()  # Last .env-filen

app = FastAPI()

# Tillatte domener – legg til ditt deploy-domene her
origins = [
    "http://localhost:5173",           # Vite dev server
    "https://dittdomene.vercel.app",   # Sett inn ditt prod-domene
]

# Aktiver CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ruter
app.include_router(protected.router)

# Helse-sjekk (valgfritt)
@app.get("/api/health")
def health_check():
    return {"status": "ok"}
