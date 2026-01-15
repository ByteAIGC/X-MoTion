#!/usr/bin/env bash
set -euo pipefail

# --- Config ---
DEFAULT_REPO_URL="git@github.com:ByteAIGC/X-MoTion.git"
REPO_URL="${1:-$DEFAULT_REPO_URL}"     # optional override: ./deploy.sh <repo-url>
PUBLISH_BRANCH="gh-pages"
COMMIT_MESSAGE="Publish build - $(date '+%Y-%m-%d %H:%M:%S %Z')"
# --------------

log()  { printf 'ℹ️  %s\n' "$*"; }
ok()   { printf '✅ %s\n' "$*"; }
warn() { printf '⚠️  %s\n' "$*"; }
err()  { printf '❌ %s\n' "$*"; }

# 1) Ensure repo + correct remote
if [ ! -d .git ]; then
  log "Initializing git repo…"
  git init
fi

# Store original remote URL to restore later
ORIGINAL_REMOTE=""
if git remote get-url origin >/dev/null 2>&1; then
  ORIGINAL_REMOTE="$(git remote get-url origin)"
  cur="$ORIGINAL_REMOTE"
  if [ "$cur" != "$REPO_URL" ]; then
    log "Temporarily updating remote origin to $REPO_URL (was $cur)…"
    git remote set-url origin "$REPO_URL"
  fi
else
  log "Adding remote origin $REPO_URL…"
  git remote add origin "$REPO_URL"
fi
ok "Deploy origin: $(git remote get-url origin)"

# 2) Install deps if needed
if [ ! -d node_modules ]; then
  log "Installing dependencies…"
  npm install
fi

# 3) Build
log "Building site…"
npm run build

# 4) Detect build folder (Vite usually 'dist', you were using 'build')
BUILD_DIR=""
if [ -d dist ]; then BUILD_DIR="dist"
elif [ -d build ]; then BUILD_DIR="build"
else
  err "No build output found (expected 'dist/' or 'build/')."
  exit 1
fi
ok "Using build dir: $BUILD_DIR"

# 5) Ensure Pages helpers in build
: > "$BUILD_DIR/.nojekyll"
# Uncomment for client-side routing:
# [ -f "$BUILD_DIR/index.html" ] && cp "$BUILD_DIR/index.html" "$BUILD_DIR/404.html"

# 6) Show what we’re about to publish
log "Build size:"
du -sh "$BUILD_DIR" || true
log "Sample of files to publish:"
find "$BUILD_DIR" -maxdepth 2 -type f | head -n 10 || true

# 7) Publish via orphan branch (cleanest)
CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD || echo main)"
log "Publishing to $PUBLISH_BRANCH (orphan)…"
git checkout --orphan "$PUBLISH_BRANCH" 2>/dev/null || git checkout --orphan "$PUBLISH_BRANCH"

# Clear the index (orphan branch has no tree yet) and add only build files
# Use work-tree to avoid copying build into repo
git --work-tree "$BUILD_DIR" add --all
# Commit with your configured identity
git -c user.name="$(git config user.name)" -c user.email="$(git config user.email)" \
  commit -m "$COMMIT_MESSAGE" || warn "Nothing to commit (no changes vs last deploy)"

# Force-push (deploy branch is build artifact; overwrite is expected)
log "Pushing $PUBLISH_BRANCH to $(git remote get-url origin)…"
git push -f origin "$PUBLISH_BRANCH"

# 8) Return to your source branch and clean up the orphan state locally
git checkout -f "$CURRENT_BRANCH"
git branch -D "$PUBLISH_BRANCH" 2>/dev/null || true

# 9) Restore original remote if it was changed
if [ -n "$ORIGINAL_REMOTE" ] && [ "$ORIGINAL_REMOTE" != "$REPO_URL" ]; then
  log "Restoring original remote to $ORIGINAL_REMOTE…"
  git remote set-url origin "$ORIGINAL_REMOTE"
  ok "Remote restored to: $(git remote get-url origin)"
fi

ok "Deployed!  https://byteaigc.github.io/X-MoTion/"
