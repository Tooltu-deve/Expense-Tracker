# MySQL Installation Guide (macOS)

This guide helps you install and configure MySQL on macOS for the Expense Tracker app.

## Option 1: Homebrew (Recommended)

### Step 1: Install MySQL

```bash
brew install mysql
```

### Step 2: Start MySQL

```bash
# Start MySQL (runs in background)
brew services start mysql

# Or run once (foreground)
mysql.server start
```

### Step 3: Secure installation (first-time setup)

```bash
mysql_secure_installation
```

You will be prompted to:
- Set root password (recommended)
- Remove anonymous users
- Disallow root login remotely
- Remove test database

### Step 4: Create a database and user (optional, for better security)

```bash
mysql -u root -p
```

Then in MySQL shell:

```sql
-- Create database (app will create it automatically if it doesn't exist)
CREATE DATABASE IF NOT EXISTS expense_tracker;

-- Create a dedicated user (recommended for production)
CREATE USER 'expense_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON expense_tracker.* TO 'expense_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 5: Update backend `.env`

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root          # or 'expense_user' if you created one
DB_PASSWORD=your_password
DB_NAME=expense_tracker
```

---

## Option 2: MySQL Installer (Official DMG)

1. Download MySQL Community Server from: https://dev.mysql.com/downloads/mysql/
2. Choose **macOS** and download the DMG package.
3. Run the installer and follow the wizard.
4. Note the temporary root password shown at the end.
5. MySQL will be installed and started automatically.

To change the root password later:

```bash
mysql -u root -p
# Enter the temp password, then:
ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_new_password';
```

---

## Option 3: Docker

```bash
docker run -d \
  --name mysql-expense \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=expense_tracker \
  -p 3306:3306 \
  mysql:8
```

Update `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=expense_tracker
```

---

## Verify MySQL is running

```bash
mysql -u root -p -e "SELECT 1"
```

If you see `1` in the output, MySQL is working.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Can't connect to MySQL server` | Ensure MySQL is running: `brew services start mysql` or `mysql.server start` |
| `Access denied for user` | Check username/password in `.env` |
| Port 3306 in use | Change `DB_PORT` in `.env` or stop the conflicting service |
