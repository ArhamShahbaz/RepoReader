# RepoReader

**RepoReader** is a full‑stack AI assistant that lets you connect your GitHub account, index any of your repositories, and then **chat with the code** — ask questions, get explanations, and receive answers grounded in the actual source files (RAG — Retrieval‑Augmented Generation).

It uses a **local LLM** (via [Ollama](https://ollama.com/)) so your code never leaves your machine, and stores code embeddings in **PostgreSQL + pgvector**.

---

## Table of Contents

1. [Features](#features)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Repository Layout](#repository-layout)
5. [Prerequisites](#prerequisites)
6. [Getting the Code](#1-getting-the-code)
7. [Infrastructure Setup](#2-infrastructure-setup-postgres--ollama)
8. [GitHub OAuth App](#3-create-a-github-oauth-app)
9. [Backend Setup & Run](#4-backend---spring-boot)
10. [Frontend Setup & Run](#5-frontend---react--vite)
11. [Using the App](#using-the-app)
12. [API Reference (short)](#api-reference-short)
13. [Git Workflow](#git-workflow-clone--pull--commit--push)
14. [Troubleshooting](#troubleshooting)

---

## Features

- 🔐 **GitHub OAuth2 login** — sign in with your GitHub account.
- 📚 **Repository sync** — list all your GitHub repos in one dashboard.
- 🧠 **Repository indexing** — asynchronously fetches the repo tree, chunks source files, embeds them, and stores vectors in pgvector.
- 💬 **Streaming chat (SSE)** — ask questions about an indexed repo; answers stream in token‑by‑token.
- 📎 **Citations** — responses include references to the actual files/chunks used to answer.
- 🖥️ **Modern UI** — React 19 + Vite 8 + Tailwind 4 + shadcn/ui components.
- 🏠 **Fully local AI** — models run through Ollama on your machine.

---

## Architecture

```
┌────────────────────┐        HTTP / SSE         ┌─────────────────────────┐
│  Frontend (Vite)   │  ───────────────────────► │   Backend (Spring Boot) │
│  React 19 + TS     │  ◄─────────────────────── │   Java 21               │
│  http://localhost  │      session cookie       │   http://localhost:8080 │
│       :5173        │                           └───────────┬─────────────┘
└────────────────────┘                                       │
                                                             │
                          ┌──────────────────────────────────┼───────────────────┐
                          │                                  │                   │
                          ▼                                  ▼                   ▼
                ┌───────────────────┐         ┌────────────────────────┐  ┌──────────────┐
                │ GitHub REST API   │         │ PostgreSQL 16 +        │  │ Ollama       │
                │ (repos, tree,     │         │ pgvector (Docker)      │  │ (LLM + embed)│
                │  file contents)   │         │ localhost:5433         │  │ :11434       │
                └───────────────────┘         └────────────────────────┘  └──────────────┘
```

---

## Tech Stack

### Backend (`RepoReader/`)

| Item | Version |
|---|---|
| Language | **Java 21** |
| Framework | **Spring Boot 4.1.1** |
| Build tool | **Maven** (wrapper included: `mvnw` / `mvnw.cmd`) |
| AI | **Spring AI 2.0.1** (Ollama + pgvector starter) |
| Persistence | Spring Data JPA + Hibernate |
| Database | **PostgreSQL 16** with `pgvector` extension |
| Auth | Spring Security OAuth2 Client (**GitHub**) |
| Utilities | Lombok, Jakarta Validation |

### Frontend (`repo_reader/`)

| Item | Version |
|---|---|
| Runtime | **Node.js ≥ 20** (Vite 8 / React 19 requirement) |
| Package manager | **npm** (comes with Node.js) |
| Framework | **React 19** + **TypeScript 6** |
| Bundler | **Vite 8** |
| Styling | **Tailwind CSS 4** + `tw-animate-css` |
| UI components | shadcn/ui, Base UI React, Lucide/Hugeicons |
| Data | **@tanstack/react-query 5** |
| Routing | **react-router-dom 7** |
| Streaming | SSE (native `fetch` + `EventSource`) |

### Infrastructure

| Item | Version |
|---|---|
| **Docker** + **Docker Compose** | latest |
| **Ollama** | latest (chat model `qwen3:1.7b`, embeddings `nomic-embed-text`) |

---

## Repository Layout

```
RepoReader/                    ← git repo root
├── README.md                  ← you are here
├── .gitignore
├── RepoReader/                ← BACKEND (Spring Boot)
│   ├── pom.xml
│   ├── mvnw / mvnw.cmd        ← Maven wrapper
│   ├── docker-compose.yml     ← Postgres + pgvector
│   ├── docker/postgres/init-extensions.sql
│   └── src/main/
│       ├── java/com/ai/reporeader/
│       │   ├── RepoReaderApplication.java
│       │   ├── config/        ← CORS, crypto, app config
│       │   ├── controller/    ← AuthController, RepoController, ChatController
│       │   ├── security/      ← GitHub OAuth2 integration
│       │   ├── service/       ← Repo, Chat, indexing, AI (RAG)
│       │   ├── entity/ · dto/ · repo/ · enums/ · exceptions/
│       └── resources/application.yml
│
└── repo_reader/               ← FRONTEND (React + Vite)
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig*.json
    ├── index.html
    ├── .env.example
    └── src/
        ├── main.tsx · App.tsx · index.css
        ├── pages/             ← home, login, dashboard, chat, auth-callback
        ├── components/        ← chat/, dashboard/, layout/, ui/ (shadcn), providers/
        ├── hooks/             ← use-auth, use-repos, use-chat
        └── lib/               ← api client, stream-chat, query keys
```

---

## Prerequisites

Install these once before you start:

| Tool | Windows | macOS / Linux | Verify |
|---|---|---|---|
| **Git** | [git-scm.com](https://git-scm.com/download/win) | `brew install git` / package manager | `git --version` |
| **Java 21 (JDK)** | [Adoptium Temurin 21](https://adoptium.net/temurin/releases/?version=21) | `brew install --cask temurin@21` / SDKMAN | `java -version` |
| **Node.js 20+** | [nodejs.org](https://nodejs.org/) (LTS) | `brew install node` / nvm | `node -v` & `npm -v` |
| **Docker Desktop** | [docker.com](https://www.docker.com/products/docker-desktop/) | `brew install --cask docker` | `docker --version` |
| **Ollama** | [ollama.com/download](https://ollama.com/download) | `brew install ollama` / script | `ollama --version` |

> Maven is **not** required — the project ships with the Maven Wrapper (`mvnw`/`mvnw.cmd`).

You will also need a **GitHub account** and permission to create an OAuth App on it.

---

## 1. Getting the Code

```bash
git clone https://github.com/arhamshahbazpk/RepoReader.git
cd RepoReader
```

Everything below is run from that folder.

---

## 2. Infrastructure setup (Postgres + Ollama)

### 2.1 Start PostgreSQL + pgvector via Docker

From the **backend** folder:

```bash
cd RepoReader
docker compose up -d
```

This launches a container `devpilot-postgres` on **host port `5433`** with:

- database `devpilot`
- user `postgres`, password `postgres`
- pre‑installed extensions: `vector`, `hstore`, `uuid-ossp`

Check it's healthy:

```bash
docker compose ps
```

To stop it later: `docker compose down` (add `-v` to also wipe data).

### 2.2 Start Ollama and pull the models

```bash
# Start the Ollama server (leave it running)
ollama serve

# In another terminal, pull the models used by the backend:
ollama pull qwen3:1.7b
ollama pull nomic-embed-text
```

Verify Ollama is listening on `http://localhost:11434` (default).

---

## 3. Create a GitHub OAuth App

1. Go to **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Fill it in:
   - **Application name**: `RepoReader (local)`
   - **Homepage URL**: `http://localhost:5173`
   - **Authorization callback URL**: `http://localhost:8080/login/oauth2/code/github`
3. Click **Register application**, then **Generate a new client secret**.
4. Copy the **Client ID** and **Client Secret** — you'll need them in the next step.

> The scopes requested by the app are `read:user` and `repo` (defined in `application.yml`).

---

## 4. Backend — Spring Boot

### 4.1 Configure secrets (recommended)

The default `RepoReader/src/main/resources/application.yml` contains placeholder GitHub OAuth credentials and encryption secrets. **Do not commit real secrets.** Override them locally in either of two ways:

**Option A — environment variables** (preferred; Spring Boot maps them automatically):

```bash
# PowerShell (Windows)
$env:SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GITHUB_CLIENT_ID     = "<your client id>"
$env:SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GITHUB_CLIENT_SECRET = "<your client secret>"
$env:APP_TOKEN_ENCRYPTOR_PASSWORD = "<any long random string>"
$env:APP_TOKEN_ENCRYPTOR_SALT     = "<any long random hex string>"
```

```bash
# bash / zsh (macOS, Linux)
export SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GITHUB_CLIENT_ID="<your client id>"
export SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GITHUB_CLIENT_SECRET="<your client secret>"
export APP_TOKEN_ENCRYPTOR_PASSWORD="<any long random string>"
export APP_TOKEN_ENCRYPTOR_SALT="<any long random hex string>"
```

**Option B — a local override file** (git‑ignored):

Create `RepoReader/src/main/resources/application-local.yml`:

```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          github:
            client-id: <your client id>
            client-secret: <your client secret>
app:
  token-encryptor-password: <any long random string>
  token-encryptor-salt: <any long random hex string>
```

Then run with the `local` profile (see 4.3).

### 4.2 Install dependencies / build

From the **backend** folder:

```bash
cd RepoReader

# Windows
.\mvnw.cmd clean install -DskipTests

# macOS / Linux
./mvnw clean install -DskipTests
```

### 4.3 Run the backend

```bash
# Windows
.\mvnw.cmd spring-boot:run

# macOS / Linux
./mvnw spring-boot:run

# With the local profile (Option B above)
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=local"     # Windows
./mvnw spring-boot:run -Dspring-boot.run.profiles=local           # macOS / Linux
```

The API will start on **`http://localhost:8080`**. Hibernate will auto‑create tables on first launch (`ddl-auto: update`).

### 4.4 Run the tests

```bash
.\mvnw.cmd test        # Windows
./mvnw test            # macOS / Linux
```

---

## 5. Frontend — React + Vite

### 5.1 Configure the environment

From the **frontend** folder:

```bash
cd repo_reader
copy .env.example .env      # Windows (PowerShell: cp .env.example .env)
cp   .env.example .env      # macOS / Linux
```

Contents of `.env`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

### 5.2 Install dependencies

```bash
npm install
```

### 5.3 Run the dev server

```bash
npm run dev
```

Open **`http://localhost:5173`** in your browser.

### 5.4 Other frontend scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type‑check (`tsc -b`) and produce a production build in `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run lint` | Run ESLint over the project |

---

## Using the App

Once **Postgres**, **Ollama**, the **backend**, and the **frontend** are all running:

1. Open <http://localhost:5173> and click **Sign in with GitHub**.
2. You'll be redirected through GitHub OAuth back to `/auth/callback`.
3. In the **Dashboard**, your GitHub repositories are listed.
4. Click **Index** on a repository — the backend clones the tree via GitHub API, chunks the files, generates embeddings via Ollama, and stores them in pgvector. Status updates as `PENDING → INDEXING → READY` (or `FAILED`).
5. When status is **READY**, open the repo's **Chat** page and start asking questions. Answers stream in and cite the source files used.

---

## API Reference (short)

All endpoints under `/api/**` require an authenticated session cookie (`DEVPILOT_SESSION`) obtained via the OAuth flow. CORS is opened for `http://localhost:5173`.

### Auth
| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/auth/login-url` | Returns the OAuth2 authorization URL |
| `GET` | `/api/auth/me` | Current authenticated user |
| `POST` | `/api/auth/logout` | Ends the session |

### Repositories
| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/repos?refresh=true` | Sync from GitHub and list repos |
| `GET` | `/api/repos/{id}` | Get one repo |
| `POST` | `/api/repos/{id}/index` | Start async indexing |
| `GET` | `/api/repos/{id}/status` | Indexing progress + status |

### Chat
| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/chat/sessions` | Create a chat session for a repo |
| `GET` | `/api/chat/sessions?repositoryId=...` | List sessions |
| `GET` | `/api/chat/sessions/{id}` | Get messages |
| `POST` | `/api/chat/sessions/{id}/messages` | **SSE** stream of a new answer |

---

## Git Workflow (clone / pull / commit / push)

Default branch: **`develop`**.

```bash
# 1. Clone (first time)
git clone https://github.com/arhamshahbazpk/RepoReader.git
cd RepoReader

# 2. Get the latest changes
git checkout develop
git pull origin develop

# 3. Create a feature branch
git checkout -b feature/<short-description>

# 4. Stage & commit your changes
git status                          # see what changed
git add <files>                     # or:  git add -A   to stage everything
git commit -m "feat: short, clear description"

# 5. Push your branch
git push -u origin feature/<short-description>

# 6. Open a Pull Request against `develop` on GitHub
```

Suggested commit prefixes: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`.

Keeping your feature branch up to date:

```bash
git checkout develop
git pull origin develop
git checkout feature/<short-description>
git rebase develop      # or:  git merge develop
```

---

## Troubleshooting

**Backend won't start / `Connection refused` to Postgres**
Make sure the Docker container is up on port 5433: `docker compose ps` inside `RepoReader/`. Restart with `docker compose up -d`.

**`ConnectException` to Ollama / long timeouts**
Ollama must be running (`ollama serve`) and the models pulled (`ollama list` should show `qwen3:1.7b` and `nomic-embed-text`).

**Login loop / "OAuth failed"**
Double‑check the callback URL in your GitHub OAuth App is exactly `http://localhost:8080/login/oauth2/code/github`, and that `client-id`/`client-secret` are set (env vars or `application-local.yml`).

**CORS errors in the browser**
The frontend must be served from `http://localhost:5173` (the default `vite` port). If you change it, update `app.cors.allowed-origins` and `app.frontend-url` in the backend config.

**Frontend build fails on `npm install` with an engines warning**
Use Node.js **20 or newer** (`node -v`). Older versions are not supported by Vite 8 / React 19.

**Port already in use**
- Backend `8080` → set `SERVER_PORT=8081` env var before running.
- Frontend `5173` → run `npm run dev -- --port 5174` (and update `app.frontend-url` / `app.cors.allowed-origins`).
- Postgres `5433` → change the left side of the port mapping in `docker-compose.yml`.

**Indexing gets stuck / rate‑limited**
GitHub rate limits API calls per token. The backend paces requests via `GitHubRateLimiter`; large repositories may take a while. Check backend logs for `429` responses.

---

Happy hacking! 🚀
