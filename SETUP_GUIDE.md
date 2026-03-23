# Supabase Configuration Instructions

## Environment Setup
1. **Create a Supabase account**:  Go to [Supabase](https://supabase.io/) and sign up for a new account.
2. **Create a new project**: After logging in, click on the "New Project" button. Enter a name, choose a password for your database, and select a region.
3. **Configure API keys**: This will allow your application to connect to Supabase.
   - Once your project is created, you can find your Project URL and API Key in the Project Settings under API.

## Table Creation SQL
Use the following SQL commands to create necessary tables in your Supabase database. You can run these commands in the SQL editor provided in the Supabase dashboard.

```sql
-- Create Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create Posts Table
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Troubleshooting Guide
1. **Connection Issues**: If you cannot connect to the database,
   - Check your API keys and Project URL in your Supabase project settings.
   - Ensure your local environment variables are correctly set up.

2. **SQL Errors**: If you encounter errors while running SQL scripts,
   - Verify your SQL syntax.
   - Ensure that you are using the correct database schema.

3. **Data Retrieval Problems**: If you can't retrieve data from your tables,
   - Check your queries for correctness.
   - Ensure your user has adequate permissions to access the data.

4. **Contact Support**: If you continue facing issues, don’t hesitate to reach out to Supabase support or check their [documentation](https://supabase.io/docs) for additional help.