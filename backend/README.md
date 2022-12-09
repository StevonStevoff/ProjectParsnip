# Setting up development environment

## Install python3.10

Ensure you have python3.10 installed.

On ubuntu run these commands:

```
$ sudo apt update && sudo apt upgrade -y
$ sudo apt install software-properties-common -y
$ sudo add-apt-repository ppa:deadsnakes/ppa

$ sudo apt install python3.10
```

If you don't have ubuntu I trust you to figure this out yourself :)

## Install poetry

Run this command to setup poetry:

```
$ curl -sSL https://install.python-poetry.org | python3 -
```

If you have any issue with this or want to read more about it [check the docs](https://python-poetry.org/docs/)

## Install Dependencies

Get python dependencies by running the following command:

```
$ poetry install
```

## Using Poetry

In order to use the virtual poetry environment, you can either run commands directly through the virtual environment using the following command:

```
$ poetry run <command>
```

or you can open a shell inside of the poetry environment using this command:

```
$ poetry shell
```

# Code Formatting

For this project we are using Black to automatically format our python code.

## Using Black Manually

Black can be run on either all files and recursively in directories using:

```
$ poetry run black .
```

or on a single file

```
$ poetry run black example.py
```

> Note: For these examples, the `poetry run` prefix is not required if inside of a poetry shell

## Pre Commit Hook

I have set up a pre commit hook which will run black automatically on committing, so for general workflow all you will need to do to format your code is commit normally.

In order to enable these hooks for your commits, run this command:

```
$ poetry run pre-commit install
```

If one of the automattic formatting hooks (such as black or prettier) fails, just commit a second time so that the changes made by the formatters will be picked up
