CREATE TABLE IF NOT EXISTS price_plan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plan_name TEXT NOT NULL,
    sms_price REAL NOT NULL,
    call_price REAL NOT NULL
);
