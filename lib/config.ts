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

export class Config {
  private account: string | undefined;
  private region: string | undefined;

  private resolverFuncRoleName: string;
  private resolverFuncRoleDesc: string;
  private resolverFuncName: string;

  private defaults = {
    resolverFuncRoleName: "resolver-role",
    resolverFuncRoleDesc: "Role for resolver function",
    resolverFuncName: "resolver",
  };

  constructor() {
    this.account =
      process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT;
    this.region =
      process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION;

    this.resolverFuncRoleName =
      process.env.RESOLVER_FUNC_ROLE_NAME || this.defaults.resolverFuncRoleName;
    this.resolverFuncRoleDesc =
      process.env.RESOLVER_FUNC_ROLE_DESC || this.defaults.resolverFuncRoleDesc;
    this.resolverFuncName =
      process.env.RESOLVER_FUNC_NAME || this.defaults.resolverFuncName;
  }

  getAccount(): string | undefined {
    return this.account;
  }
  getRegion(): string | undefined {
    return this.region;
  }

  getResolverFuncRoleName(): string {
    return this.getValWithEnv(this.resolverFuncRoleName);
  }
  getResolverFuncRoleDesc(): string {
    return this.resolverFuncRoleDesc;
  }
  getResolverFuncName(): string {
    return this.getValWithEnv(this.resolverFuncName);
  }

  private getValWithEnv(val: string): string {
    return val + "-" + process.env.ENV_NAME;
  }
}
