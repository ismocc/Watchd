<img src="movie-tracker/public/favicon.svg" width="72" alt="" />

# Watchd

Letterboxd style movie diary im building to learn Angular + NestJS. You can log what you watch with half star ratings and reviews, make lists and see your stats.

## Features

- accounts (register / login with JWT)
- trending movies + search (data from TMDB)
- movie pages with backdrop, plot, director and cast
- log a movie: half star rating, review, watch date, like, rewatch
- diary grouped by month, you can edit/delete entrys
- lists (no duplicates, keeps the order)
- profile stats: films, films this year, hours watched, avg rating, rating spread, recent watches, liked films

## Stack

Angular frontend -> NestJS backend -> Postgres with Prisma. When deployed the backend also serves the built frontend, so its just one server.

The backend is the only thing that talks to TMDB so the api key doesnt end up in the browser. Posters load straight from TMDB's image server tho.

## Hosting it (for your family, friends etc)

Easiest way is with Docker. On the server:

```bash
git clone <this repo>
cd watchd
cp .env.example .env
```

Fill in `.env`:

- `TMDB_API_KEY` - free at https://www.themoviedb.org/settings/api
- `JWT_SECRET` - any long random string
- `INVITE_CODE` - something only your family knows, people need it to sign up. If you leave it empty anyone can make an account

then

```bash
docker compose up -d
```

and its running on `http://<your-server>:3000`. The database is created and updated automatically.

**Updating:** `git pull` then `docker compose up -d --build`. Your data stays (its in a docker volume).

**HTTPS / own domain:** put [Caddy](https://caddyserver.com) in front. A `Caddyfile` with just this is enough, it gets the certificate by itself:

```
movies.yourdomain.com {
  reverse_proxy localhost:3000
}
```

**Backup:** `docker compose exec db pg_dump -U watchd watchd > backup.sql`

## Running it for development

You need Node 20+, pnpm and Postgres.

### Backend

```bash
cd backend
pnpm install
cp .env.example .env
```

then fill in `.env`:

- `DATABASE_URL` - your postgres connection string (make an empty `watchd` database first)
- `JWT_SECRET` - any long random string
- `TMDB_API_KEY` - you can get one for free at https://www.themoviedb.org/settings/api

and then

```bash
pnpm prisma migrate dev
pnpm start:dev
```

### Frontend

```bash
cd movie-tracker
pnpm install
pnpm start
```

open http://localhost:4200 and make an account. The dev server forwards `/api` calls to the backend on :3000 (see `proxy.conf.json`).

## API

Everything is under `/api`.

| Method | Route | Auth |
| --- | --- | --- |
| POST | /auth/register | |
| POST | /auth/login | |
| GET | /auth/me | ✓ |
| GET | /movies/trending | |
| GET | /movies/search?q= | |
| GET | /movies/:id | |
| GET | /logs, /logs?movie=:id | ✓ |
| POST | /logs | ✓ |
| PATCH / DELETE | /logs/:id | ✓ |
| GET / POST | /lists | ✓ |
| GET / PATCH / DELETE | /lists/:id | ✓ |
| POST | /lists/:id/items | ✓ |
| DELETE | /lists/:id/items/:tmdbId | ✓ |
| GET | /stats/me | ✓ |

This product uses the TMDB API but is not endorsed or certified by TMDB.
