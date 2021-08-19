/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import * as cdk from "@aws-cdk/core";
import * as AwsAppSync from "@aws-cdk/aws-appsync";
import { join } from "path";
import { Lambda, LambdaProps } from "../constructs/Lambda";
import { Config } from "./config";

export class CdkTsAppSyncLambdaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    if (process.env.ENV_NAME) {
      super(scope, id, props);

      const config = new Config();

      const directLambdaResolver = this.addResolverFunction(config);
      this.addGraphqlApi(directLambdaResolver);

      cdk.Tags.of(this).add("APP_NAME", "CDK_SAMPLE");
      cdk.Tags.of(this).add("ENVIRONMENT", process.env.ENV_NAME);
    } else {
      throw new Error("ENV_NAME environment variable is mandatory.");
    }
  }

  /**
   *
   * @param config GraphQL
   */
  private addGraphqlApi(directLambdaResolver: Lambda) {
    const api = new AwsAppSync.GraphqlApi(this, "Api", {
      name: "AppsyncWithLambdaResolverApi",
      schema: AwsAppSync.Schema.fromAsset(join(__dirname, "schema.graphql")),
      xrayEnabled: true,
      logConfig: {
        excludeVerboseContent: false,
        fieldLogLevel: AwsAppSync.FieldLogLevel.ALL,
      },
    });

    //Add resolver lambda function as a direct lambda resolver to GraphqlApi
    const datasource = api.addLambdaDataSource(
      "DirectLambdaResolver",
      directLambdaResolver.getLambdaHandler()
    );

    const fields = [
      { typeName: "Query", fieldName: "getTodo" },
      { typeName: "Query", fieldName: "listTodos" },
      { typeName: "Mutation", fieldName: "createTodo" },
      { typeName: "Mutation", fieldName: "updateTodo" },
      { typeName: "Mutation", fieldName: "deleteTodo" },
    ];
    fields.forEach(({ typeName, fieldName }) =>
      datasource.createResolver({ typeName, fieldName })
    );

    new cdk.CfnOutput(this, "graphqlUrl", { value: api.graphqlUrl });
    new cdk.CfnOutput(this, "apiKey", {
      value: api.apiKey ?? "No key generated",
    });
    new cdk.CfnOutput(this, "apiId", { value: api.apiId });
    new cdk.CfnOutput(this, "lambda", {
      value: directLambdaResolver.getLambdaHandler().functionArn,
    });
  }

  /**
   * Lambda Functions
   * @param config
   */
  private addResolverFunction(config: Config) {
    const lambdaProps: LambdaProps = {
      handler: "resolver.handler",
      assetsPath: "src/Resolver/lib",
      functionName: config.getResolverFuncName(),
      functionRoleDesc: config.getResolverFuncRoleDesc(),
      functionRoleName: config.getResolverFuncRoleName(),
    };

    return new Lambda(this, config.getResolverFuncName(), lambdaProps);
  }
}
