-- Database Schema & RLS Setup for Toph Dashboard

-- 1. Create logs table
CREATE TABLE IF NOT EXISTS public.logs (
  id text PRIMARY KEY,
  employee_name text NOT NULL,
  activity text NOT NULL,
  date date NOT NULL,
  field text NOT NULL,
  time_start text NOT NULL,
  time_end text NOT NULL,
  lat numeric,
  lng numeric,
  tags text[] DEFAULT '{}'::text[],
  summary text,
  audio_path text,
  created_at timestamptz DEFAULT now()
);

-- 2. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text not null,
  role text check (role in ('admin', 'employee')) not null
);

-- 3. Enable RLS and Realtime
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Enable real-time broadcasts for the logs table so the frontend updates automatically
ALTER PUBLICATION supabase_realtime ADD TABLE public.logs;


-- 4. Policies for logs
-- Note: Allowing all users (anon & authenticated) to read/update for ease of development.
-- You can later change 'TO public' to 'TO authenticated' to lock it down.
DROP POLICY IF EXISTS "Enable read access for all users" ON public.logs;
CREATE POLICY "Enable read access for all users" ON public.logs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable update for all users" ON public.logs;
CREATE POLICY "Enable update for all users" ON public.logs FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Enable insert for all users" ON public.logs;
CREATE POLICY "Enable insert for all users" ON public.logs FOR INSERT WITH CHECK (true);

-- 5. Policies for profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);

-- 6. Storage bucket for recordings
INSERT INTO storage.buckets (id, name, public) 
VALUES ('recordings', 'recordings', false) 
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "Anyone can select recordings" ON storage.objects;
CREATE POLICY "Anyone can select recordings" 
ON storage.objects FOR SELECT USING ( bucket_id = 'recordings' );

DROP POLICY IF EXISTS "Anyone can insert recordings" ON storage.objects;
CREATE POLICY "Anyone can insert recordings" 
ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'recordings' );

DROP POLICY IF EXISTS "Anyone can update recordings" ON storage.objects;
CREATE POLICY "Anyone can update recordings" 
ON storage.objects FOR UPDATE USING ( bucket_id = 'recordings' );

-- 7. Insert mock data so the dashboard doesn't fall back to local mock data without audio_path
TRUNCATE public.logs;

INSERT INTO public.logs (id, employee_name, activity, date, field, time_start, time_end, lat, lng, tags, summary, audio_path)
VALUES 
('log-001', 'Isaac Wang', 'Spraying', '2026-09-16', 'A', '6:00 AM', '10:40 AM', 41.9774, -93.4475, ARRAY['herbicide', 'pre-emergent'], 'Offline guided voice log created at 2026-09-16. Applied herbicide to the eastern section of Field A in preparation for the fall planting cycle. Coverage was consistent with no blockages reported on the spray equipment. Conditions were calm with light wind at 4 mph.', 'farmer1.mp3'),
('log-002', 'Maya Patel', 'Harvesting', '2026-09-16', 'B', '7:30 AM', '11:15 AM', 41.9791, -93.4502, ARRAY['soybeans', 'combine'], 'Soybean harvest completed across the full northern portion of Field B. Moisture readings averaged 12.8%. No mechanical issues encountered. Yield estimated at 52 bu/acre pending final weigh-in.', 'farmer2.mp3'),
('log-003', 'Liam Johnson', 'Planting', '2026-09-16', 'C', '8:00 AM', '12:00 PM', 41.9755, -93.4490, ARRAY['cover-crop', 'rye'], 'Cover crop seeding completed on Field C using winter rye at 1.2 bu/acre. Seed-to-soil contact was good following recent tillage. Irrigation scheduled for the following morning.', 'farmer3.mp3'),
('log-004', 'Sophia Lee', 'Irrigation', '2026-09-16', 'D', '6:30 AM', '9:30 AM', 41.9730, -93.4540, ARRAY['drip-irrigation', 'corn'], 'Drip irrigation cycle run on Field D corn block. System pressure held steady at 18 PSI. Flow meters showed 0.6 in applied. One emitter replaced near the southwest corner.', 'farmer4.mp3'),
('log-005', 'Isaac Wang', 'Spraying', '2026-09-13', 'B', '6:45 AM', '8:30 AM', 41.9755, -93.4490, ARRAY['fungicide'], 'Preventive fungicide application to Field B wheat. Canopy was fully wet from morning dew; delayed start by 45 min. Full coverage achieved at recommended rate of 8 oz/acre.', 'farmer1.mp3'),
('log-006', 'Liam Johnson', 'Planting', '2026-09-12', 'A', '7:30 AM', '1:00 PM', 41.9774, -93.4475, ARRAY['wheat', 'fall-seeding'], 'Winter wheat seeded at 1.8 bu/acre on Field A. Seed treated with fungicide. Planter calibration checked prior to run — row spacing 7.5 in. Soil temperature logged at 61°F.', 'farmer3.mp3'),
('log-007', 'Maya Patel', 'Harvesting', '2026-09-11', 'D', '9:00 AM', '4:00 PM', 41.9730, -93.4540, ARRAY['corn', 'silage'], 'Corn silage harvest completed on Field D. Chop length set to ¾ in. Kernel processor engaged throughout. Forage test sample collected and sent to lab. Clamp covered by end of day.', 'farmer2.mp3'),
('log-008', 'Sophia Lee', 'Irrigation', '2026-09-10', 'C', '4:30 AM', '6:45 AM', 41.9801, -93.4512, ARRAY['overhead', 'pivot'], 'Center pivot run completed on Field C. 0.5 in applied uniformly. Pivot speed set to 45% for desired application rate. No leaks or alignment issues observed during post-run inspection.', 'farmer4.mp3');
