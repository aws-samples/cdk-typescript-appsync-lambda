# Overview

This package contains CDK infrastructure code for deploying an AWS AppSync API which leverages a direct Lambda resolver written in TypeScript for API business logic.

This code repository can be used as a starting point for TypeScript CDK projects using AppSync. Here's everything included in this repository:

* CDK code and resolver Lambda function code to bootstrap a project and scaffold a project structure.
* Build script to build the Lambda function with one command.
* Jest configuration to run unit test cases against both CDK and Lambda code.
* Project level configuration for prettier and ESLint.
* Config to generate environment specific names for cloud resources. For example, if ENV_NAME is set to `test`, `Resolver` function name would be `Resolver_test`


## Project Setup

The project has one direct resolver Lambda function for demonstration. Its located in the `/src` folder. The build script generates JS files and copies node_modules with only production dependencies to `src/{LAMBDA_DIRCTORY}/lib`. This directory is specifed as `assetsPath` in `lib/cdk-ts-appsync-lambda-stack.ts`.

The `cdk.json` file tells the CDK Toolkit how to execute this app.

`lib/cdk-ts-appsync-lambda-stack` defines the stack. The stack defines an AppSync API with a direct lambda resolver.

`lib/config.ts` defines different configurations needed to build the stack. The configurations can  be passed as environment variables or default values will be used. For each configuration, there is an accessor function that contains logic on whether the value should be returned directly or if it should have a post fix of `_{ENV_NAME}`.

Individual Lambda function is in `src` folder. The Lambda project is set up as an independent NodeJS project.

`src/{LAMBDA_NAME}` contains individual Lambda code. TypeScript files are compiled in `/lib` directory. `package.json` file in each Lambda project contains thress scripts -

* `prebuild` - Runs `npm install` before build
* `build` - Compiles TyeScript code in `/lib` directory.
* `package` - Updates `node_modules` directory to remove all dev dependencies and then copies the updated `node_modules` to `/lib`

After `package` runs, `/lib` will have the JS files and dependencies needed to publish Lambda function to AWS.

Unit tests for the CDK stack are in `__tests__` directory and for individual Lamda's test cases are in `/src/{LAMBDA_NAME}/__tests__`

### Configurations

* **ESLint** : ESLint configuration is in the root directory. The lambda project package.json refers to this file in lint command. run npm run lint from root.

* **Prettier** :  Prettier configurations are also on root directory. Run npm run format from root directory

* **Typescript** : Typescript config (tsconfig.json) are at both Lambda and CDK project levels.

* **Jest** : jest.config is only at root project as the test will only be executed from root directory.


## Steps to set up

### Prerequisites

1.	Access to an AWS account using both AWS Console and AWS CLI V2. Instructions to configure AWS CLI V2 are available [here](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html).
2.	AWS CDK is setup. The instructions are available [here](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html#getting_started_install). 
3.	NodeJS is installed. Download latest version from [here](https://nodejs.org/en/download/).
4.	Git is installed (to pull code from repository). The instructions are available [here](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
5.	VS Code or any other IDE for TypeScript development.
6.	If using windows, use git-bash as terminal. It’s installed as part of installing Git.


### Install and Deploy
From project root directory, run following commands -
* `npm install`
* `npm run build`
* `npm run package`
* `export ENV_NAME=test` - This sets the environment name to `test`, so the resources will have post-fix of `_test` in their name.
* `npm run test`
* `cdk deploy`


## Useful commands

### Customized Commands
 * `npm run build`   Builds CDK TypeScript, all Lambda function under /src and updates each function /lib directory with node_modules
 * `npm run lint`    runs ESLint validation on entire project, including all Lambda applications
 * `npm run format`  runs Prettier to format all TypeScript code - CDK and Lambda applications.
 * `npm run test`    perform the jest unit tests for CDK stack and all Lambda function. The coverage information will be generated in `coverage` directory.

### Commands available out of box with CDK.
 * `npm run watch`   watch for changes and compile
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

### References

[AWS CDK Developer Guide](https://docs.aws.amazon.com/cdk/latest/guide/home.html)

[Creating a serverless application using the AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/serverless_example.html)


## License

This library is licensed under the MIT-0 License. See the LICENSE file.

