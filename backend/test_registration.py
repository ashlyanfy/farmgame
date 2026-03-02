#!/usr/bin/env python3
"""
Простой тест регистрации без Redis
"""
import asyncio
import sys
import os

# Добавляем путь к приложению
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

from app.database import async_session
from app.models import User
from app.routers.auth import _hash_password, _init_user_records
from app.schemas.auth import UserCreate
from sqlalchemy import select

async def test_registration():
    """Тестируем регистрацию пользователя"""
    
    # Создаем тестового пользователя
    user_data = UserCreate(
        username="testuser",
        password="testpass123",
        language="RU"
    )
    
    async with async_session() as db:
        # Проверяем, что пользователь не существует
        existing = await db.execute(select(User).where(User.username == user_data.username))
        if existing.scalar_one_or_none():
            print(f"Пользователь {user_data.username} уже существует")
            return
        
        # Создаем пользователя
        user = User(
            username=user_data.username,
            password_hash=_hash_password(user_data.password),
            language=user_data.language,
        )
        db.add(user)
        await db.flush()  # получаем user.id
        
        print(f"Создан пользователь: {user.id}, {user.username}")
        
        # Инициализируем связанные записи
        await _init_user_records(user.id, db)
        await db.commit()
        await db.refresh(user)
        
        print(f"Регистрация успешна! ID: {user.id}")
        print(f"Username: {user.username}")
        print(f"Referral code: {user.referral_code}")
        print(f"Language: {user.language}")
        print(f"Created at: {user.created_at}")

if __name__ == "__main__":
    asyncio.run(test_registration())