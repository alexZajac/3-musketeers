# Currency CLI Interface - A tool to give the exchange rate between any type of currencies.

## Demo - Exchange rate between 10 BTC and EUR value

![](./demo.gif)

## Installation

![](https://media.giphy.com/media/lYZjoIy0UOEJa/source.gif)

1 - Fork the project and clone it to your local system

```sh
❯ cd /your/local/path
❯ git clone git@github.com:YOUR_USERNAME/3-musketeers.git
```

2 - Use npm/yarn to install/update dependencies:

```sh
❯ cd /your/local/path/3-musketeers/currency
❯ npm install # or yarn
```

## Usage

![](https://media.giphy.com/media/Ln2dAW9oycjgmTpjX9/source.gif)

The command line interface accepts 3 paramters:
| | Amount | From | To | |
| ------------- | ------ | ---- | --- | --- |
| Required | No | No | No | |
| Default Value | 1 | USD | BTC | |
| | | | | |

```sh
❯ node cli.js (...args)
```

_Note: If the console throws an error, it could mean that it cannot find one of the two currencies you provided_

## Features

![](https://media.giphy.com/media/Rfjm0SIyKFcuQ/source.gif)

- The CLI handles a various range of currencies avalaible on this [API](https://api.exchangeratesapi.io).
- You can access an example with:

```sh
cli.js --help
```

- Handles both tradionnal currencies and cryptocurrencies.

## Tests

The test suite is handled with [Jest](https://jestjs.io/en/).

```sh
npm test
```

The coverage report is available on this [website](https://currency-coverage.netlify.com/).
