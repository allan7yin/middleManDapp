import sqlite3 as sqlite
import random

def create_database():
    conn = sqlite.connect('./src/middleman.sqlite3') 
    c = conn.cursor()

    c.execute("""
    CREATE TABLE IF NOT EXISTS world_id(
        address TEXT PRIMARY KEY,
        count INTEGER
    )
    """)

    # transaction type is one of 0 (value), 1 (erc721/erc20 transfer/approval events)
    # safety is one of 0 (inpermissible, due to irretrievable funds or known blacklisted address) (show simulation)
    # 1, warnings, due to other reports (show simulation)
    # 2. warning, but only because of new address, show simulation for transfer/approval events
    # 3. permit, redirect to etherscan because it's whitelisted in some way
    # complaints, simulation is base64 json encoded lists
    c.execute("""
    CREATE TABLE IF NOT EXISTS transactions(
        hash TEXT PRIMARY KEY,
        from_adr TEXT,
        to_adr TEXT,
        value TEXT,
        gas_price INT,
        gas_limit INT,
        gas_used INT,
        errors TEXT,
        warnings TEXT,
        simulation TEXT,
        raw_transaction TEXT,
        world_id INT
    )
    """)
    conn.close()

def random_hex_string(l):
    hex_chars = '1234567890abcdef'
    o = '0x'
    
    for i in range(l):
        o += str(hex_chars[random.randint(0, 15)])
    return o

def generate_bogus_data():
    conn = sqlite.connect('./src/middleman.sqlite3') 
    c = conn.cursor()

    c.execute(f"""INSERT INTO transactions (
        hash,
        from_adr,
        to_adr,
        value,
        gas_price,
        gas_limit,
        gas_used,
        errors,
        warnings,
        simulation,
        raw_transaction,
        world_id
    ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""", (
        random_hex_string(64),
        random_hex_string(40),
        random_hex_string(40),
        '2.000',
        18000000000,
        73189,
        43758,
        'big error',
        'smol warning',
        'somebase64jsonsomethingsomething',
        '0xtotallyrealrawsignedtransaction',
        2
    ))

    conn.commit()
    conn.close()

    print('bogus data generated.')


create_database()
generate_bogus_data() 
