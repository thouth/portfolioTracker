from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TransactionCreate(BaseModel):
    ticker: str
    trade_type: str  # 'BUY' eller 'SELL'
    shares: float
    price: float
    trade_date: Optional[datetime] = None

class Transaction(TransactionCreate):
    id: str
    user_id: str
    inserted_at: datetime
