-- Create leave_balances table
CREATE TABLE public.leave_balances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  annual_leave INTEGER NOT NULL DEFAULT 25,
  sick_leave INTEGER NOT NULL DEFAULT 10,
  personal_leave INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on leave_balances
ALTER TABLE public.leave_balances ENABLE ROW LEVEL SECURITY;

-- Create policies for leave_balances
CREATE POLICY "Employees can view their own leave balance" 
ON public.leave_balances 
FOR SELECT 
USING (auth.uid() = employee_id);

CREATE POLICY "Employees can update their own leave balance" 
ON public.leave_balances 
FOR UPDATE 
USING (auth.uid() = employee_id);

-- Create trigger for leave_balances timestamp updates
CREATE TRIGGER update_leave_balances_updated_at
  BEFORE UPDATE ON public.leave_balances
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update the handle_new_user function to also create leave balance
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'employee')
  );
  
  -- Insert into leave_balances
  INSERT INTO public.leave_balances (employee_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create profiles and leave balances for existing users
INSERT INTO public.profiles (user_id, full_name, role)
SELECT 
  id,
  COALESCE(raw_user_meta_data ->> 'full_name', ''),
  'employee'
FROM auth.users 
WHERE id NOT IN (SELECT user_id FROM public.profiles);

INSERT INTO public.leave_balances (employee_id)
SELECT id
FROM auth.users 
WHERE id NOT IN (SELECT employee_id FROM public.leave_balances);