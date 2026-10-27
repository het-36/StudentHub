# StudentHub Local Deployment

## Requirements
- PHP
- MySQL
- Modern web browser

## Database
The file studenthub_schema.sql contains the database structure without existing records.

## Run the current project
From the project root, run:

    php -S localhost:8000

Open http://localhost:8000/ in the browser. Keep Terminal open while testing. This is PHP's development server, not an Apache virtual-host deployment.

## Apache
Confirm Apache is installed and inspect its configuration before setting up a virtual host.

## Known limitation
The main repository currently contains no PHP backend files. Authentication, role restrictions and database-backed CRUD require backend implementation before they can be claimed as working.
