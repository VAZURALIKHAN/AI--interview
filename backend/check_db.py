"""
Simple script to check database connection and tables
Run this with: python check_db.py
"""
import sqlite3
import os

db_path = 'interview_prep.db'

# Check if database file exists
if os.path.exists(db_path):
    print("✅ Database file found!")
    print(f"📍 Location: {os.path.abspath(db_path)}")
    print(f"📏 Size: {os.path.getsize(db_path)} bytes")
    print()
else:
    print("❌ Database file not found!")
    print("💡 Start the backend server to create it automatically")
    exit()

# Connect to database
try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    print("✅ Successfully connected to database!")
    print()
    
    # Get all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    
    print(f"📊 Found {len(tables)} tables:")
    for table in tables:
        table_name = table[0]
        
        # Count rows in each table
        cursor.execute(f"SELECT COUNT(*) FROM {table_name};")
        count = cursor.fetchone()[0]
        
        print(f"  - {table_name}: {count} records")
    
    print()
    
    # Check users specifically
    cursor.execute("SELECT COUNT(*) FROM users;")
    user_count = cursor.fetchone()[0]
    
    if user_count > 0:
        print(f"👥 Total Users: {user_count}")
        
        # Show user details (without passwords!)
        cursor.execute("SELECT id, email, name, total_xp, level, streak_count FROM users;")
        users = cursor.fetchall()
        
        print("\n📝 User List:")
        for user in users:
            print(f"  - ID: {user[0]}, Email: {user[1]}, Name: {user[2]}")
            print(f"    XP: {user[3]}, Level: {user[4]}, Streak: {user[5]} days")
    else:
        print("👥 No users yet - create an account to get started!")
    
    conn.close()
    print("\n✅ Database check complete!")
    
except Exception as e:
    print(f"❌ Error: {e}")
