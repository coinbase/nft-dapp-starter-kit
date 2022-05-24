#! /usr/bin/env node
"use strict";

const { program } = require("commander");
const inquirer = require("inquirer");
const chalk = require("chalk");
const CLI = require("clui");
const Spinner = CLI.Spinner;
const fs = require("fs");
const path = require("path");
const cp = require("child_process");

const handleExit = () => {
  console.log(chalk.green("Exiting without error."));
  process.exit();
};

const handleError = (e) => {
  console.error(chalk.red("ERROR! An error was encountered while executing"));
  console.error(e);
  console.log(chalk.red("Exiting with error."));
  process.exit(1);
};

process.on("SIGINT", handleExit);
process.on("uncaughtException", handleError);

async function start({ dir, force }) {
  const status = new Spinner("creating");
  console.log();
  console.log();
  console.log(
    chalk.yellow(
      "=^..^=   =^..^=   =^..^=    =^..^=    =^..^=    =^..^=    =^..^="
    )
  );
  console.log(
    chalk.blue(`Creating NFT DApp Starter ${dir ? `in ${dir}` : ""}`)
  );

  // make sure user does not have git conflicts
  const gitStatus = cp.execSync(`git status --porcelain`).toString();
  if (!force && gitStatus.trim() !== "") {
    console.log(
      chalk.red("Please commit your changes before running this script!")
    );
    console.log(chalk.red("Exiting because `git status` is not empty:"));
    console.log();
    console.log(chalk.grey(gitStatus));
    console.log();
    process.exit(1);
  }

  const result = await inquirer.prompt([
    {
      message: `Output Directory?`,
      name: "directory",
      type: "input",
      default: ".",
    },
    {
      message: `Install all defaults`,
      name: "defaults",
      type: "confirm",
      default: "y",
    },
  ]);

  if (result.directory != ".") {
    console.log(chalk.blue("Installing in", result.directory));
  }
  status.start();

  // Install NFT DApp Starter Kit

  console.log(
    chalk.yellow(
      "_,.-'~'-.,__,.-'~'-.,__,.-'~'-.,__,.-'~'-.,__,.-'~'-.,__,.-'~'-.,__,."
    )
  );
  status.stop();
}

program
  .command("init")
  .option("-o, --output [dir]", "output directory")
  .option("-f, --force [isForce]", "force, ignores staged files")
  .description("Bootstrap NFT DApp Starter Kit")
  .action(start);

program.parse();
