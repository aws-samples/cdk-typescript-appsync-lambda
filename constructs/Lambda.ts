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

import { Construct } from "@aws-cdk/core";
import * as AwsLambda from "@aws-cdk/aws-lambda";
import * as AwsIam from "@aws-cdk/aws-iam";

export interface LambdaProps {
  policyStatements?: AwsIam.PolicyStatement[];
  managedPolicies?: AwsIam.IManagedPolicy[];
  handler: string;
  assetsPath: string;
  permissions?: AwsLambda.Permission[];
  functionName: string;
  functionRoleDesc: string;
  functionRoleName: string;
  environment?: { [key: string]: string } | undefined;
}

export class Lambda extends Construct {
  private lambdaHandler: AwsLambda.Function;

  constructor(scope: Construct, id: string, props: LambdaProps) {
    super(scope, id);

    const inlinePolicyDoc = new AwsIam.PolicyDocument();
    if (props.policyStatements && props.policyStatements.length > 0) {
      props.policyStatements.forEach((policyStatement) => {
        inlinePolicyDoc.addStatements(policyStatement);
      });
    }

    if (props.managedPolicies && props.managedPolicies.length > 0) {
      props.managedPolicies.push(
        AwsIam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaBasicExecutionRole"
        )
      );
    } else {
      props.managedPolicies = [
        AwsIam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaBasicExecutionRole"
        ),
      ];
    }

    const execRole = new AwsIam.Role(this, props.functionRoleName, {
      assumedBy: new AwsIam.ServicePrincipal("lambda.amazonaws.com"),
      description: props.functionRoleDesc,
      managedPolicies: props.managedPolicies,
      inlinePolicies:
        props.policyStatements && props.policyStatements.length > 0
          ? {
              INLINE_POLICY: inlinePolicyDoc,
            }
          : undefined,
      roleName: props.functionRoleName,
    });

    const lambdaFunction = new AwsLambda.Function(this, props.functionName, {
      runtime: AwsLambda.Runtime.NODEJS_14_X,
      code: AwsLambda.Code.fromAsset(props.assetsPath),
      handler: props.handler,
      role: execRole,
      functionName: props.functionName,
      environment: props.environment,
    });

    this.lambdaHandler = lambdaFunction;

    if (props.permissions && props.permissions.length > 0) {
      let index = 1;
      props.permissions.forEach((permission) => {
        lambdaFunction.addPermission("lambda_permission_" + index, permission);
        index++;
      });
    }
  }

  getLambdaHandler(): AwsLambda.Function {
    return this.lambdaHandler;
  }
}
