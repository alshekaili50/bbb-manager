-- Create a function to delete a user and their data
create or replace function public.delete_user()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  user_id uuid;
begin
  -- Get the ID of the user making the request
  user_id := auth.uid();
  
  if user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Delete user's data from your tables
  -- Add more DELETE statements for other tables as needed
  delete from instances where user_id = user_id;
  
  -- Delete the user's auth account
  -- This will cascade to delete their session and other auth-related data
  delete from auth.users where id = user_id;
end;
$$; 