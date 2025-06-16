from tests.test_imports import stub_modules
import os, sys
import types
import importlib

# ensure backend directory is on path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.models import TransactionCreate

def test_trade_type_normalization(monkeypatch):
    stub_modules(monkeypatch)
    tx = TransactionCreate(ticker="AAPL", trade_type="buy", shares=1, price=1.0)
    assert tx.trade_type == "BUY"

