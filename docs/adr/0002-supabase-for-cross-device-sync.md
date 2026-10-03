# Use Supabase as the backend for cross-device sync

The owner uses the same Backlog on an iPad and a Windows PC, so purely local browser storage is not enough. We use Supabase (free tier, with login) as a hosted backend instead of running our own server, which also leaves room for multiple users if the app is published later. The cost is a dependency on a hosted service and a login step even for a single-user app.
