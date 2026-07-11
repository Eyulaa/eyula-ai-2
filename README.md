# Eyula AI — Deployment Guide (Cloudflare Pages via GitHub, Free Tier)

Important: Cloudflare's dashboard "drag and drop" upload does **not** support the `functions/` folder — it only works for plain static files. Since this site needs `functions/api/chat.js` to work, it has to be deployed by connecting a GitHub repo instead. This guide walks through that from scratch, assuming no prior Git experience.

## Step 1 — Create a GitHub account (skip if you have one)

Go to https://github.com and sign up.

## Step 2 — Create a new repository

1. Go to https://github.com/new
2. Name it something like `eyula-ai`
3. Leave it **Public** or **Private** — either works with Cloudflare Pages
4. Don't check any of the "initialize with README" boxes
5. Click **Create repository**
6. Leave this page open — GitHub will show you commands, but you can also just use the **"uploading an existing file"** link on that page instead of the command line

## Step 3 — Upload the files

**Easiest way (no terminal):**
1. On your new empty repo's page, click **"uploading an existing file"**
2. Drag in `index.html` and `README.md`
3. For the `functions` folder: GitHub's web uploader supports folders — drag the whole `functions` folder in (it should preserve `functions/api/chat.js` as the path). If it doesn't keep the folder structure, create the file manually instead: click **Add file → Create new file**, type `functions/api/chat.js` as the filename (GitHub auto-creates the folders from the slashes), then paste in the contents of that file
4. Scroll down, click **Commit changes**

**If you're comfortable with a terminal instead:**
```
cd path/to/unzipped/eyula-site
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/eyula-ai.git
git push -u origin main
```

## Step 4 — Connect the repo to Cloudflare Pages

1. Go to https://dash.cloudflare.com → **Workers & Pages**
2. Click **Create** → **Pages** → **Connect to Git**
3. Authorize Cloudflare to access your GitHub account, then select the `eyula-ai` repo
4. On the build settings screen: leave everything as default / empty — there's no build step, this is static HTML plus Functions. Just click **Save and Deploy**

## Step 5 — Turn on the Workers AI binding

This replaces needing an API key — and it's free.

1. In your new Pages project, go to **Settings → Functions**
2. Scroll to **AI bindings** → click **Add binding**
3. Set the variable name to exactly `AI` (the code expects `env.AI`)
4. Save
5. Go to **Deployments** → retry/redeploy the latest deployment so the binding takes effect

## Step 6 — Test it

Open your `*.pages.dev` URL and send a message. If it errors, check **Workers & Pages → your project → Deployments → [latest] → Functions → real-time logs**.

## Making future edits

Any time you want to change the site, edit the files in your GitHub repo (either upload a new version of a file through the GitHub web UI, or `git push` if using the terminal). Cloudflare Pages automatically redeploys whenever the repo changes — no need to touch the Cloudflare dashboard again after this first setup.

## Free tier limits

- **10,000 "Neurons" per day**, reset daily, no cost, no card required. A typical short chat reply uses on the order of a few hundred, so this comfortably covers personal or small-scale use.
- If you exceed it, requests just fail until the next daily reset — nothing bills you automatically.

## Model quality note

This uses `@cf/meta/llama-3.1-8b-instruct`, an open-source model — good for everyday conversation, but not as strong as Claude on complex reasoning or nuanced writing. You can swap in other free models Cloudflare hosts by changing the model string in `functions/api/chat.js` — full list at https://developers.cloudflare.com/workers-ai/models/.

## A few things to know

- **No login/auth on the endpoint.** Anyone with your URL can chat with it. Heavy traffic could burn through the daily allowance and block real visitors.
- **Custom domain (optional).** In your Pages project: **Custom domains** tab → add your domain and follow the DNS instructions.
