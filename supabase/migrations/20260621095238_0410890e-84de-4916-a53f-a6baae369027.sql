
-- Drop trigger on auth.users if present
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop legacy tables (cascades policies and FKs)
DROP TABLE IF EXISTS public.votes CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.feature_requests CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop legacy functions (no longer referenced)
DROP FUNCTION IF EXISTS public.get_vote_counts() CASCADE;
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role) CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- Drop the app_role enum (no longer used)
DROP TYPE IF EXISTS public.app_role CASCADE;
