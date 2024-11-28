#!/usr/bin/env node

import { execSync } from "child_process";
import { existsSync, rmSync } from "fs";
import inquirer from "inquirer";
import chalk from "chalk";

const log = console.log;
const templateUrl = "https://github.com/0xNizar/Diszar-Template";

// Ask the user for the template URL and project name
const getUserInput = async () => {
  const { projectName } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Enter the project name:",
      validate: (input) =>
        input ? true : "Project name cannot be empty.",
    },
  ]);

  return { projectName };
};

// Clone the GitHub template and set up the project
const setupProject = async ({ projectName }) => {
  if (existsSync(projectName)) {
    log(chalk.red(`Directory "${projectName}" already exists. Aborting.`));
    process.exit(1);
  }

  try {
    log(chalk.green("Cloning the template..."));
    execSync(`git clone ${templateUrl} ${projectName}`, { stdio: "inherit" });

    log(chalk.green("Removing Git history from the template..."));
    rmSync(`${projectName}/.git`, { recursive: true, force: true });

    log(chalk.green("Initializing a new Git repository..."));
    execSync(`cd ${projectName} && git init`, { stdio: "inherit" });

    log(chalk.green("Installing dependencies..."));
    execSync(`cd ${projectName} && npm install`, { stdio: "inherit" });

    log(chalk.blue("\nProject setup complete! 🚀"));
    log(chalk.yellow(`\nTo get started, run:\n  cd ${projectName}\n`));
  } catch (error) {
    log(chalk.red("An error occurred during the setup process."));
    console.error(error);
  }
};

(async () => {
  const userInput = await getUserInput();
  await setupProject(userInput);
})();