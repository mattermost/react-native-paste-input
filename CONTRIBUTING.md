# Code Contribution Guidelines

Thank you for your interest in contributing! Please see the [Mattermost Contribution Guide](https://developers.mattermost.com/contribute/getting-started/) which describes the process for making code contributions across Mattermost projects and [join our "Native Mobile Apps" community channel](https://pre-release.mattermost.com/core/channels/native-mobile-apps) to ask questions from community members and the Mattermost core team.

When you submit a pull request, it goes through a [code review process outlined here](https://developers.mattermost.com/contribute/getting-started/code-review/).

## Development workflow

To get started with the project, run `npm run bootstrap` in the root directory to install the required dependencies for each package:

```sh
npm run bootstrap
```

While developing, you can run the [example app](/example/) to test your changes.

To start the packager:

```sh
npm run example start
```

To run the example app on Android:

```sh
npm run example run android
```

To run the example app on iOS:

```sh
npm run example run ios
```

Make sure your code passes TypeScript and ESLint. Run the following to verify:

```sh
npm run typescript
npm run lint
```

To fix formatting errors, run the following:

```sh
npm run lint -- --fix
```

Remember to add tests for your change if possible. Run the unit tests by:

```sh
npm test
```

To edit the Objective-C files, open `example/ios/ReactNativePasteInputExample.xcworkspace` in XCode and find the source files at `Pods > Development Pods > @mattermost/react-native-paste-input`.

To edit the Kotlin files, open `example/android` in Android studio and find the source files at `mattermostreactnativepasteinput` under `Android`.

### Commit message convention

We follow the [conventional commits specification](https://www.conventionalcommits.org/en) for our commit messages:

- `fix`: bug fixes, e.g. fix crash due to deprecated method.
- `feat`: new features, e.g. add new method to the module.
- `refactor`: code refactor, e.g. migrate from class components to hooks.
- `docs`: changes into documentation, e.g. add usage example for the module..
- `test`: adding or updating tests, eg add integration tests using detox.
- `chore`: tooling changes, e.g. change CI config.

Our pre-commit hooks verify that your commit message matches this format when committing.

### Linting and tests

[ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [TypeScript](https://www.typescriptlang.org/)

We use [TypeScript](https://www.typescriptlang.org/) for type checking, [ESLint](https://eslint.org/) with [Prettier](https://prettier.io/) for linting and formatting the code, and [Jest](https://jestjs.io/) for testing.

Our pre-commit hooks verify that the linter and tests pass when committing.

### Scripts

The `package.json` file contains various scripts for common tasks:

- `npm run bootstrap`: setup project by installing all dependencies and pods.
- `npm run typescript`: type-check files with TypeScript.
- `npm run lint`: lint files with ESLint.
- `npm run test`: run unit tests with Jest.
- `npm run example start`: start the Metro server for the example app.
- `npm run example android`: run the example app on Android.
- `npm run example ios`: run the example app on iOS.

### Sending a pull request

> **Working on your first pull request?** You can learn how from this _free_ series: [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github).

When you're sending a pull request:

- Prefer small pull requests focused on one change.
- Verify that linters and tests are passing.
- Review the documentation to make sure it looks good.
- Follow the pull request template when opening a pull request.
- For pull requests that change the API or implementation, discuss with maintainers first by opening an issue.
