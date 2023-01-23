# Jexpe Contributing Guide

Hi! We, the maintainers, are really excited that you are interested in contributing to Jexpe. Before submitting your
contribution though, please make sure to take a moment and read through the [Code of Conduct](CODE_OF_CONDUCT.md), as
well as the appropriate section for the contribution you intend to make:

- [Issue Reporting Guidelines](#issue-reporting-guidelines)
- [Development Guide](#development-guide)
- [Pull Request Guidelines](#pull-request-guidelines)

**We strongly advise you to join the [Jexpe Discord](https://discord.com/invite/cfHmUnPDtM) to discuss your contribution
with the community.**

## Issue Reporting Guidelines

- The issue list of this repo is **exclusively** for bug reports and feature requests. Non-conforming issues will be
  closed immediately.

- If you have a question, you can get quick answers from the [Jexpe Discord](https://discord.com/invite/cfHmUnPDtM).

- Try to search for your issue, it may have already been answered or even fixed in the development branch (`dev`).

- Check if the issue is reproducible with the latest stable version of Jexpe. If you are using a pre-release, please
  indicate the specific version you are using.

- It is **required** that you clearly describe the steps necessary to reproduce the issue you are running into. Although
  we would love to help our users as much as possible, diagnosing issues without clear reproduction steps is extremely
  time-consuming and simply not sustainable.

- Use only the minimum amount of code necessary to reproduce the unexpected behavior. A good bug report should isolate
  specific methods that exhibit unexpected behavior and precisely define how expectations were violated. What did you
  expect the method or methods to do, and how did the observed behavior differ? The more precisely you isolate the
  issue, the faster we can investigate.

- Issues with no clear repro steps will not be triaged. If an issue labeled "need repro" receives no further input from
  the issue author for more than 5 days, it will be closed.

- If your issue is resolved but still open, don’t hesitate to close it. In case you found a solution by yourself, it
  could be helpful to explain how you fixed it.

- Most importantly, we beg your patience: the team must balance your request against many other responsibilities —
  fixing other bugs, answering other questions, new features, new documentation, etc. The issue list is not paid
  support, and we cannot make guarantees about how fast your issue can be resolved.

## Development Guide

**Jexpe is undergoing rapid development right now, and the docs match the latest published version. They
are horribly out of date when compared with the code in the development branch (`dev`). This contributor guide is up-to-date, but it
doesn't cover all of Jexpe's functions in depth. If you have any questions, don't hesitate to ask in
our [Jexpe Discord](https://discord.com/invite/cfHmUnPDtM)**

Is this repository we stick to the following branch structure:

| Branch | Description |
|-|-|
| `dev` | The develop branch is where all the working branches are merged. It's not possible to push code directly here, not even for a maintainer. Everything in `dev` must come from a pull request after a code review. |
| `<working>` | Working branches are always created from `dev` and to `dev` shall return! Only working branches should be merged in to the develop branch after a code review. |
| `release` | Release branches are handled by [code owners](https://github.com/jexpe-apps/jexpe/blob/dev/.github/CODEOWNERS). A release branch contains all the features planned for that release. |

## Pull Request Guidelines

You must read the [Development Guide](#development-guide) section before proceeding with the pull request guidelines.

In this project we stick to the following naming convention for the Pull Request title:

```yml
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ Summary: Present tense. Not capitalized. No period at the end.
  │       │
  │       └─⫸ Scope: tauri|nextjs|<issue-id>
  │
  └─⫸ Type: build|ci|docs|feat|fix|perf|refactor
```

The `<type>` and `<summary>` fields are mandatory, the `(<scope>)` field is optional.

##### Type must be one of the following:
>* **build**: Changes that affect the build system or external dependencies (example scopes: yarn)
>* **ci**: Changes to our CI configuration files and scripts (examples: Github Actions)
>* **docs**: Documentation only changes
>* **feat**: A new feature
>* **fix**: A bug fix
>* **perf**: A code change that improves performance
>* **refactor**: A code change that neither fixes a bug nor adds a feature


##### Scope should be one of the following:
>The scope should be the name of the package affected.
>
>* **tauri**: Backend **only** changes
>* **nextjs**: Frontend **only** changes
>* **\<issue-id\>**: Reference of the fixed issue

##### Summary
>Use the summary field to provide a succinct description of the change:
>
>* use the imperative, present tense: "change" not "changed" nor "changes"
>* don't capitalize the first letter
>* no dot (.) at the end

**You must follow this convention also for the working branch name: `<type>/<summary>`, _e.g. `build/migrate_yarn`.**

##### Some clarifications
>- It's OK to have multiple small commits as you work on the PR - We will let GitHub automatically squash it before
>  merging. (That is why we are restrictive about the title of the PR)
>
>- If adding new feature:
>
>    - Provide convincing reason to add this feature. Ideally you should open a suggestion issue first and have it
>      greenlighted before working on it.
>
>- If fixing a bug:
>    - If you are resolving a special issue, in the `<scope>` set the issue id in your PR title for a better release log, _e.g. `fix(#3899): ...`.
>    - Provide detailed description of the bug in the PR, or link to an issue that does.

## Financial Contribution

Jexpe is an MIT-licensed open source project. Its ongoing development can be supported [here](https://github.com/jexpe-apps/jexpe/blob/dev/.github/FUNDING.yml)
