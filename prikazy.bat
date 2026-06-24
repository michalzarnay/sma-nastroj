git checkout main
git pull
git checkout -b e2e-a-automatizacia
# (skopíruj do repa nové/zmenené súbory: playwright.config.ts, e2e/,
#  .github/workflows/e2e.yml, CLAUDE.md, .github/workflows/auto-fix.yml)
git add -A
git commit -m "E2E vrstva + E2E brána v CLAUDE.md a auto-fix"
git push -u origin e2e-a-automatizacia