#!/bin/bash

# Get environment variables
source ../.env.local

# Apply migrations using psql
for file in migrations/*.sql; do
  echo "Applying migration: $file"
  PGPASSWORD=$SUPABASE_DB_PASSWORD psql -h $SUPABASE_DB_HOST -U postgres -d postgres -f "$file"
done

echo "Migrations completed successfully" 