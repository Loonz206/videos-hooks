# GitHub Copilot Instructions

This document provides instructions for GitHub Copilot to ensure that all generated code adheres to our project's coding standards, which are based on **JavaScript Standard Style** and **SonarSource's principles for clean and secure code**.

When generating, refactoring, or explaining code, please follow these guidelines strictly.

---

## 1. JavaScript Standard Style

These rules are based on `standard`. The goal is to have consistent, readable, and clean JavaScript code without configuration.

### Formatting & Style

- **Indentation**: Use 2 spaces for indentation. No tabs. And to adhere to the .editorconfig file, ensure that the indentation is consistent across all files.
- **Strings**: Use single quotes for strings, except to avoid escaping.
- **Semicolons**: Do not use semicolons at the end of statements. But let Prettier handle semicolons automatically.
- **Commas**: Use a space after commas. No trailing commas in object or array literals.
- **Spacing**:
  - Add a space after keywords (e.g., `if (condition)`).
  - Add a space before a function declaration's parentheses (e.g., `function name (arg)`).
  - Use spaces around infix operators (e.g., `a + b`).
- **Blocks**:
  - Use curly braces for all multi-line `if` statements.
  - Keep `else` statements on the same line as their closing curly brace.
  - Add spaces inside single-line blocks (e.g., `function foo() { return true }`).
- **Naming**: Use camelCase for variables and functions. Use PascalCase for constructor names.

### Language Features & Best Practices

- **Equality**: Always use `===` and `!==` instead of `==` and `!=`. The only exception is `obj == null` to check for `null || undefined`.
- **Variables**:
  - No unused variables.
  - Declare each variable with its own statement (e.g., `const foo = 1; const bar = 2;`).
- **Error Handling**: Always handle the `err` parameter in callbacks and Promises.
- **Globals**: Declare browser globals with a `/* global ... */` comment.
- **ES6+**:
  - Prefer `const` and `let` over `var`.
  - Use template literals instead of string concatenation.
  - Use property shorthands in objects (`{ name }` instead of `{ name: name }`).

---

## 2. SonarSource-inspired Rules for Quality & Security

These rules focus on writing code that is maintainable, reliable, and secure.

### Maintainability & Readability

- **DRY (Don't Repeat Yourself)**: Avoid duplicating code blocks. Suggest creating reusable functions or components instead.
- **Cognitive Complexity**: Keep functions simple and easy to understand. A function should do one thing well. Avoid deeply nested logic.
- **No Commented-Out Code**: Do not suggest code that is commented out. If code is no longer needed, it should be removed.
- **Magic Numbers**: Avoid magic numbers. Declare them as named constants.
- **Clear Naming**: Variable and function names should be descriptive and clearly state their purpose.

### Reliability & Bug Prevention

- **Null Checks**: Always check for `null` or `undefined` before accessing properties of an object that could be nullish.
- **Promise Handling**: Ensure every Promise has a `.catch()` handler or is handled within a `try...catch` block in an `async` function.
- **Regular Expressions**: Avoid writing complex or inefficient regular expressions that could lead to Regular Expression Denial of Service (ReDoS).

### Security

- **Cross-Site Scripting (XSS)**: When generating code that handles user input and renders it in the DOM, always suggest sanitizing the input to prevent XSS attacks. For example, use `textContent` instead of `innerHTML` when inserting text.
- **Secure API Usage**: Avoid using deprecated or insecure APIs (e.g., `eval()`, `document.write()`).

---

## How to Apply These Rules

- **Code Generation**: All new code snippets, functions, or components you generate must follow these rules.
- **Refactoring**: When asked to refactor code, apply these rules to improve the existing code.
- **Explanation**: When explaining code, highlight how it aligns with (or violates) these standards.
- **Feedback**: If you encounter code that does not adhere to these standards, suggest improvements based on the guidelines above.
- **Examples**: Provide examples that illustrate the correct application of these rules.
- **Testing**: Ensure that any generated code is testable and suggest writing unit tests where applicable.
- **Documentation**: Encourage clear and concise documentation for all functions and modules, explaining their purpose, parameters, and return values.
- **Performance**: Consider performance implications of the code you generate. Avoid unnecessary computations or memory usage.
- **Version Control**: When generating code, ensure it is compatible with the project's version control practices (e.g., commit messages, branching strategies).
- **Dependencies**: Be cautious about suggesting new dependencies. Ensure they are necessary, well-maintained, and compatible with the project.
- **Code Reviews**: Encourage a culture of code reviews where peers can provide feedback on adherence to these standards.
