import os
import decimal


# Convert tuple of SQL Alchemy RowProxy objects into a list of dictionary objects (https://github.com/cs50/python-cs50/blob/develop/src/cs50/sql.py)
def convertTupleSQLtoDict(tupleOfRow):
    # Coerce types
    rows = [dict(row) for row in tupleOfRow]
    for row in rows:
        for column in row:

            # Coerce decimal.Decimal objects to float objects
            # https://groups.google.com/d/msg/sqlalchemy/0qXMYJvq8SA/oqtvMD9Uw-kJ
            if type(row[column]) is decimal.Decimal:
                row[column] = float(row[column])

            # Coerce memoryview objects (as from PostgreSQL's bytea columns) to bytes
            elif type(row[column]) is memoryview:
                row[column] = bytes(row[column])

    # Rows to be returned
    return rows
