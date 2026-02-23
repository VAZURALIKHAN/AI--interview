
import sqlite3
import os

db_path = 'interview_prep.db'

if not os.path.exists(db_path):
    print("Database not found")
    exit()

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

email = "fasuralikhan@gmail.com"
cursor.execute("SELECT id, email, name, password_hash FROM users WHERE email = ?", (email,))
user = cursor.fetchone()

if user:
    print(f"User found: ID={user[0]}, Email={user[1]}, Name={user[2]}")
    print(f"Password Hash: {user[3]}")
else:
    print(f"User {email} NOT FOUND in database.")
    
    # List all users
    print("\nListing all users:")
    cursor.execute("SELECT id, email, name FROM users")
    users = cursor.fetchall()
    for u in users:
        print(f" - {u}")

conn.close()
