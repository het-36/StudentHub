# StudentHub

StudentHub is a Web Technology project that provides a centralized interface for student academic and college-related information.

## Project Modules

- Home page and dashboard
- Student registration and login interfaces
- Student profile
- Courses, assignments and attendance
- Timetable and notices
- Events and event information
- FAQ, contact and feedback
- Administration interface

## Technologies Used

- HTML5
- CSS3
- JavaScript
- JSON data files
- MySQL schema export

## Project Structure

- `index.html` — main landing page
- `about.html` — project information
- `pages/` — portal pages
- `css/` — stylesheets
- `js/` — JavaScript modules
- `data/` — JSON data
- `docs/requirements.md` — project requirements
- `docs/deployment.md` — local deployment instructions
- `docs/test-report.md` — testing checklist and current status
- `docs/studenthub_schema.sql` — schema-only database export

## Run Locally

From the project root, start PHP's development server:

```bash
php -S localhost:8000
```

Open `http://localhost:8000/` in your browser.

The project has also been tested as a static site using the local Apache virtual host at `http://studenthub.local/`.

## Database

The file `docs/studenthub_schema.sql` contains a schema-only export. Use a separate test database when importing it. Do not overwrite existing databases.

## Testing

The main static pages have been checked for successful HTTP responses. Refer to `docs/test-report.md` for the current test checklist.

## Known Limitations

The repository does not currently contain an integrated PHP backend. Authentication, role-based access control and database CRUD operations are not yet verified as functional. These features must be implemented and tested before they can be considered complete.
