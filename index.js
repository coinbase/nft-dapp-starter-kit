#! /usr/bin/env node
"use strict";

const { program } = require("commander");
const chalk = require("chalk");
const CLI = require("clui");
const Spinner = CLI.Spinner;
const fs = require("fs");
const path = require("path");
const cp = require("child_process");

const cleanup = () => {
  console.log(chalk.green("Cleaning up."));
  // Reset changes made to package.json files.
  cp.execSync(`git checkout -- packages/*/package.json`);
  // Uncomment when snapshot testing is enabled by default:
  // rm ./template/src/__snapshots__/App.test.js.snap
};

const handleExit = () => {
  cleanup();
  console.log(chalk.green("Exiting without error."));
  process.exit();
};

const handleError = (e) => {
  console.error(chalk.red("ERROR! An error was encountered while executing"));
  console.error(e);
  cleanup();
  console.log(chalk.red("Exiting with error."));
  process.exit(1);
};

const directoryExists = (filePath) => {
  return fs.existsSync(filePath);
};

process.on("SIGINT", handleExit);
process.on("uncaughtException", handleError);

function start() {
  const status = new Spinner("");
  status.start();
  console.log();
  console.log(
    chalk.yellow(
      "=^..^=   =^..^=   =^..^=    =^..^=    =^..^=    =^..^=    =^..^="
    )
  );
  console.log(chalk.blue("Creating NFT DApp Starter"));

  // make sure user does not have git conflicts
  const gitStatus = cp.execSync(`git status --porcelain`).toString();
  if (gitStatus.trim() !== "") {
    console.log(
      chalk.red("Please commit your changes before running this script!")
    );
    console.log(chalk.red("Exiting because `git status` is not empty:"));
    console.log();
    console.log(chalk.grey(gitStatus));
    console.log();
    process.exit(1);
  }

  const currentDirectoryBase = path.basename(process.cwd());

  console.log(
    chalk.yellow(
      "=^..^=   =^..^=   =^..^=    =^..^=    =^..^=    =^..^=    =^..^="
    )
  );
  status.stop();
}

program
  .command("create")
  .description("Bootstrap NFT DApp Starter Kit")
  .action(start);

program.parse();
