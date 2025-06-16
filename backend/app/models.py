from pydantic import BaseModel, validator
from typing import Optional
from datetime import datetime

class TransactionCreate(BaseModel):
    ticker: str
    trade_type: str  # 'BUY' eller 'SELL'
    shares: float
    price: float
    trade_date: Optional[datetime] = None

    @validator("trade_type")
    def uppercase_trade_type(cls, v: str) -> str:
        return v.upper()

class Transaction(TransactionCreate):
    id: str
    user_id: str
    inserted_at: datetime
