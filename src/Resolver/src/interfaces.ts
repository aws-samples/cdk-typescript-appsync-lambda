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

import { v4 as uuidv4 } from "uuid";

export interface LambdaEvent {
  firstNumber: number;
  secondNumber: number;
}

export interface Response {
  result: number;
}

export type Todo = {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};
const createdAt = new Date();
export const todos: Todo[] = [
  { id: uuidv4(), name: "first todo", createdAt, updatedAt: createdAt },
  { id: uuidv4(), name: "second todo", createdAt, updatedAt: createdAt },
  { id: uuidv4(), name: "third todo", createdAt, updatedAt: createdAt },
  { id: uuidv4(), name: "fourth todo", createdAt, updatedAt: createdAt },
  { id: uuidv4(), name: "fifth todo", createdAt, updatedAt: createdAt },
];
