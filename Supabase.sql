create type public.app_role as enum ('admin', 'teacher', 'student');

create table public.user_roles (
  id uuid references auth.users on delete cascade not null primary key,
  role app_role not null default 'student'
);

-- Set up RLS (Row Level Security)
alter table public.user_roles enable row level security;

-- Policies for user_roles table
create policy "Users can view their own role" on public.user_roles
  for select using (auth.uid() = id);
  
create policy "Admins can view all roles" on public.user_roles
  for select using (
    exists (
      select 1 from public.user_roles where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update roles" on public.user_roles
  for update using (
    exists (
      select 1 from public.user_roles where id = auth.uid() and role = 'admin'
    )
  );

-- Function to create a new role when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_roles (id, role)
  values (new.id, 'student'); -- Default role is student
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function when a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();