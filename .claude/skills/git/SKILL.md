---
name: git
description: The full git workflow for this portfolio repo — branch off main, name the branch, commit, then merge straight back into main and push. No pull requests, no descriptions, no approval. Use whenever committing work here, proposing a branch name, writing a commit message, or shipping uncommitted changes.
---

# Git workflow

This repo has **one long-lived branch: `main`.** There is no `develop`.
Every branch is cut from `main` and merged straight back into `main`.

**No pull requests.** This is a solo repo — a branch exists to group commits and
keep the merge readable in the log, not to gate anything. Once the work is
committed, merge it into `main` and push. Do not open a PR, do not write a PR
description, do not wait for approval, do not ask whether to merge.

Never commit *directly* on `main` — the branch step is not optional, it is what
gives the merge commit something to say.

## Branch names

```
<type>/<area>
```

**Two segments. Always.** Lowercase, hyphenated, no third slash, no ticket IDs,
no dates, no author names.

`<area>` is one noun naming *what* changed — one word where one word will do,
never more than two. If you are reaching for a third word, you are describing
the commit, not the area.

**One branch per feature area, not per sub-task.** `feature/auth` — never
`feature/auth-login` + `feature/auth-signup` + `feature/auth-forgot-password`.
Work that touches the same area for the same reason shares a branch and gets
separate commits.

| Type       | Use for                                       |
| ---------- | --------------------------------------------- |
| `feature`  | New user-visible capability                   |
| `fix`      | Broken behaviour                              |
| `refactor` | Restructuring or removal, no behaviour change |
| `perf`     | Speed / bundle / render cost                  |
| `chore`    | Deps, config, tooling, CI                     |
| `docs`     | README and comments only                      |

```
feature/auth             feature/auth-login-form
feature/seo              feature/name-spellings-and-json-ld
feature/intro            feature/intro-curtain-animation-and-flip
feature/theme            feature/dark-mode-toggle-button
refactor/single-screen   refactor/delete-sections-and-clean-dead-code
perf/hero-canvas         perf/reduce-particle-count-on-mobile
chore/deps               chore/bump-next-to-16-2-11
```

## Commit messages

Conventional Commits.

```
<type>: <subject>

<body — optional, only when the why isn't obvious>
```

- **Subject**: imperative mood ("add", not "added"/"adds"), lowercase after the
  colon, no trailing period, ≤ 72 chars.
- Types are the table above, except branch `feature` is `feat` in commits.
- Scope only when it genuinely disambiguates: `fix(intro): …`. Default to none.
- **Body**: wrap at 72. Explain *why* — the diff already says what. Bullets with
  `-` for several independent points. With no PR to carry it, the body is the
  only place the reasoning lives, so write one whenever the why isn't obvious.
- Never mention Claude, AI assistance, or the session. No `Co-Authored-By`.
- **One logical change per commit.** A branch with five commits is fine; a
  commit doing five unrelated things is not.

```
feat: add opening name curtain that flips onto the nav wordmark

refactor: strip site to intro, header and hero

Removes every section below the fold plus the /work/[slug] route, then
sweeps the dead code they left behind: unused content exports, CSS
tokens with no consumer, and props no caller passed.

fix(theme): stop light mode flashing before first paint

chore: drop @react-three/drei
```

## Shipping uncommitted work

### 1. Group

Inspect `git status` and `git diff`. Split the working tree into
logically-cohesive groups — **one branch per group**, cut from `main`
independently.

Grouping is by *feature area*, matching the branch-name rule. A new capability
is one branch; an unrelated refactor is another. Do not over-split: changes that
only make sense together stay together, as separate commits on one branch. Two
commits on one branch is the common shape — prefer it over two branches whenever
the work shares a reason.

If a group's changes span hunks of a shared file, stage per hunk rather than
widening the group:

```
git diff <file> > /tmp/full.patch          # hand-trim to the wanted hunks
git apply --cached --recount /tmp/trimmed.patch
```

### 2. Branch and commit

```
git checkout main
git pull                                   # only if behind
git checkout -b <type>/<area>
git add <explicit paths>                   # never `git add .`
git commit -m "<type>: <subject>"
```

Other groups' changes stay uncommitted and carry across the checkout — stage
each group's files explicitly so they land on the right branch. If a checkout
would clobber them, `git stash push -u` first and pop on the new branch.

### 3. Verify

```
npm run build      # runs TypeScript too
npm run lint
```

This is the only gate there is — nothing downstream will catch a broken build,
so run it before merging rather than after. If it fails, fix it on the branch
and commit again; do not merge red. Report anything you did not actually run as
**unverified** rather than implying it passed.

### 4. Merge and push

```
git checkout main
git merge --no-ff <type>/<area> -m "Merge <type>/<area>: <what it did>"
git push origin main
```

`--no-ff` always, even for a single commit — the merge commit is what keeps the
branch legible as one unit in the log.

Then clean up the branch:

```
git branch -d <type>/<area>
git push origin --delete <type>/<area>     # only if it was ever pushed
```

Pushing the branch to `origin` before merging is optional and usually pointless
— merge locally and push `main`. Push the branch only if the work needs to exist
remotely before it lands (switching machines, sharing a link).

With several groups: merge each branch into `main` in turn, then push `main`
once at the end. Rebuild between merges if two branches touched the same files.

### 5. Report

Per branch: branch name, commit subjects, and what the merge moved. Confirm
`main` is pushed and the working tree is clean. Flag anything left uncommitted
and anything unverified.
