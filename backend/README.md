# Setting up development environment

## Install python3.10

Ensure you have python3.10 installed.

On ubuntu run these commands:
```
sudo apt update && sudo apt upgrade -y
sudo apt install software-properties-common -y
sudo add-apt-repository ppa:deadsnakes/ppa

sudo apt install python3.10
```

If you don't have ubuntu I trust you to figure this out yourself :)

## Install poetry

Run this command to setup poetry:
```
curl -sSL https://install.python-poetry.org | python3 -
```

If you have any issue with this or want to read more about it [check the docs](https://python-poetry.org/docs/)

## Install Dependencies

Get python dependencies by running the following command:
```
poetry install
```

## Using Poetry

In order to use the virtual poetry environment, you can either run commands directly through the virtual environment using the following command:
```
poetry run <command>
```

Or you can open a shell inside of the poetry environment using this command:
```
poetry shell
```