-- Seed data for LINKard project
-- This file contains initial data for development

-- Insert some system settings
INSERT INTO system_management.system_settings (key, value) VALUES
('app_name', '"LINKard"'),
('version', '"1.0.0"'),
('maintenance_mode', 'false'),
('max_file_size', '"50MB"')
ON CONFLICT (key) DO NOTHING;

-- Note: User profiles and other data will be created through the application signup process
-- This seed file is for system-level configuration only