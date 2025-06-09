import importlib
import os
import sys
import types

# Ensure backend directory is on path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))


def stub_modules(monkeypatch):
    # finnhub stub
    finnhub = types.ModuleType("finnhub")
    class Client:
        def __init__(self, api_key=None):
            pass
        def quote(self, symbol):
            return {"c": 0}
    finnhub.Client = Client
    monkeypatch.setitem(sys.modules, "finnhub", finnhub)

    # psycopg2 stub
    psycopg2 = types.ModuleType("psycopg2")
    psycopg2.connect = lambda *a, **k: None
    extras = types.ModuleType("psycopg2.extras")
    extras.RealDictCursor = object
    psycopg2.extras = extras
    monkeypatch.setitem(sys.modules, "psycopg2", psycopg2)
    monkeypatch.setitem(sys.modules, "psycopg2.extras", extras)

    # supabase stub
    supabase = types.ModuleType("supabase")
    class SupabaseClient:
        pass
    def create_client(url, key):
        return SupabaseClient()
    supabase.Client = SupabaseClient
    supabase.create_client = create_client
    monkeypatch.setitem(sys.modules, "supabase", supabase)

    # jose stub
    jose = types.ModuleType("jose")
    jwt = types.ModuleType("jose.jwt")
    jwt.decode = lambda *a, **k: {"sub": "user"}
    jose.jwt = jwt
    jose.JWTError = Exception
    monkeypatch.setitem(sys.modules, "jose", jose)
    monkeypatch.setitem(sys.modules, "jose.jwt", jwt)

    # httpx stub
    httpx = types.ModuleType("httpx")
    class AsyncClient:
        async def __aenter__(self):
            return self
        async def __aexit__(self, exc_type, exc, tb):
            pass
        async def get(self, url):
            class Res:
                status_code = 200
                def json(self):
                    return {"s": "ok", "c": [], "t": []}
            return Res()
    httpx.AsyncClient = AsyncClient
    monkeypatch.setitem(sys.modules, "httpx", httpx)

    # dotenv stub
    dotenv = types.ModuleType("dotenv")
    dotenv.load_dotenv = lambda *a, **k: None
    monkeypatch.setitem(sys.modules, "dotenv", dotenv)


def test_all_routes_import(monkeypatch):
    stub_modules(monkeypatch)
    modules = [
        "app.routes.holdings",
        "app.routes.transactions",
        "app.routes.stock_history",
        "app.routes.protected",
        "app.routes.portfolio",
        "app.main",
    ]
    for mod in modules:
        importlib.import_module(mod)
