
from passlib.context import CryptContext
import sqlite3
import os

# Initialize context directly to avoid import issues
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

db_path = 'interview_prep.db'
if not os.path.exists(db_path):
    print("Database not found!")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

email = "fasuralikhan@gmail.com"
new_password = "password123"
hashed_password = pwd_context.hash(new_password)

print(f"Resetting password for {email}...")

# Check if user exists first
cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
if not cursor.fetchone():
    print(f"❌ User {email} not found!")
    exit(1)

# Update password
cursor.execute("UPDATE users SET password_hash = ? WHERE email = ?", (hashed_password, email))
conn.commit()

# Verify update
cursor.execute("SELECT password_hash FROM users WHERE email = ?", (email,))
stored_hash = cursor.fetchone()[0]

if pwd_context.verify(new_password, stored_hash):
    print(f"✅ Password successfully reset to '{new_password}'")
else:
    print("❌ Error verifying new password hash!")

conn.close()
