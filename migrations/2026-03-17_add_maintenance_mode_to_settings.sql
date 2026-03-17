-- Ensure maintenanceMode exists in settings.app jsonb
UPDATE public.settings
SET app = jsonb_set(
  COALESCE(app, '{}'::jsonb),
  '{maintenanceMode}',
  'false'::jsonb,
  true
)
WHERE NOT (COALESCE(app, '{}'::jsonb) ? 'maintenanceMode');

-- Update default for new rows (optional)
ALTER TABLE public.settings
ALTER COLUMN app SET DEFAULT
  '{
    "enableDineIn": true,
    "enableDelivery": true,
    "avgDeliveryTime": "30",
    "maintenanceMode": false,
    "maxOrdersPerDay": "100",
    "enableCashPayment": true,
    "enableOnlinePayment": true
  }'::jsonb;
