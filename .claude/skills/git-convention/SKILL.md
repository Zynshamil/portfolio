---
name: git-convention
description: Branch naming and commit message convention for this portfolio repo. Use whenever proposing a branch name, writing a commit message, or opening a PR here.
---

# Branch & commit convention

The rule for this repo: **one branch per feature area, not per sub-task.**
`feature/auth` — never `feature/auth-login` + `feature/auth-signup` + `feature/auth-forgot-password`.
If two pieces of work touch the same area for the same reason, they share a branch and get separate commits.

## Branch names

```
<type>/<area>
```

- Lowercase, hyphenated, **two segments only** — no ticket IDs, no dates, no author names.
- `<area>` is one noun or noun-phrase naming *what* changed, max 2–3 words.
- Never nest a third slash. `feature/intro/curtain` is wrong; it's `feature/intro`.

### Types

| Type       | Use for                                                    |
| ---------- | ---------------------------------------------------------- |
| `feature`  | New user-visible capability                                |
| `fix`      | Broken behaviour                                            |
| `refactor` | Restructuring or removal, no behaviour change               |
| `perf`     | Speed / bundle / render cost                               |
| `chore`    | Deps, config, tooling, CI                                  |
| `docs`     | README and comments only                                    |

### Good / bad

```
feature/intro              feature/intro-curtain-animation-and-flip
feature/theme              feature/dark-mode-toggle-button
refactor/single-screen     refactor/delete-sections-and-clean-dead-code
perf/hero-canvas           perf/reduce-particle-count-on-mobile
chore/deps                 chore/bump-next-to-16-2-11
```

## Commit messages

Conventional Commits — this repo already uses them (`feat:`, `refactor:`).

```
<type>: <subject>

<body — optional, only when the why isn't obvious>
```

- **Subject**: imperative mood ("add", not "added"/"adds"), lowercase after the colon, no trailing period, ≤ 72 chars.
- Types are the same list as above, except the branch `feature` is `feat` in commits.
- Add a scope only when it genuinely disambiguates: `fix(intro): ...`. Default to no scope.
- **Body**: wrap at 72. Explain *why*, not what — the diff already says what. Bullets with `-` when there are several independent changes.
- Never mention Claude, AI assistance, or the session in the message.
- One logical change per commit. A branch with five commits is fine; a commit doing five unrelated things is not.

### Examples

```
feat: add opening name curtain that flips onto the nav wordmark

refactor: strip site to intro, header and hero

Removes every section below the fold plus the /work/[slug] route, then
sweeps the dead code they left behind: unused content exports, CSS
tokens with no consumer, and props no caller passed.

fix(theme): stop light mode flashing before first paint

chore: drop @react-three/drei
```

## PR titles

Same format as the commit subject. If the branch has one commit, the PR title is that subject verbatim.
