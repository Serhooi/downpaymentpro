DROP POLICY IF EXISTS "Anyone can insert a booking" ON public.bookings;
REVOKE INSERT ON public.bookings FROM anon, authenticated;