// MODULES REQUIRING
const axios = require("axios");
const money = require("money");

// CONSTANTS
const RATES_URL = "https://api.exchangeratesapi.io/latest";
const BLOCKCHAIN_URL = "https://blockchain.info/ticker";
const CURRENCY_BITCOIN = "BTC";

/**
 * Determines if any of the two currencies is CURRENCY_BITCOIN = 'BTC'
 * @param {String} from - The currency form which the conversion is made
 * @param {String} to - The currency to which the conversion is made
 * @return {Boolean} Whether 'from' or 'to' currency is 'BTC'
 */
const isAnyBTC = (from, to) => [from, to].includes(CURRENCY_BITCOIN);

/**
 * @typedef {Object} ExchangeOptions
 * @prop {Number} [amount=1] - Amount to convert
 * @prop {String} [from='BTC'] - Base currency
 * @prop {String} [to='EUR'] - Destination currency
 */
/**
 * Gets the current rate between two currencies
 * @param {ExchangeOptions} opts - The 'from' and 'to' currencies to evaluata
 * @return {Number} The exchange rate between the two currencies, with respect to the amount provided
 */
module.exports = async opts => {
  // destructure opts parameters, and create the result promise
  const { amount = 1, from = "USD", to = CURRENCY_BITCOIN } = opts;
  const promises = [];
  let base = from;

  // we get whether we have 'BTC' in our currencies
  const anyBTC = isAnyBTC(from, to);

  if (anyBTC) {
    // if from is 'BTC', we change it to the to currency
    base = from === CURRENCY_BITCOIN ? to : from;
    promises.push(axios(BLOCKCHAIN_URL));
  }

  // we prepend at the begionning or the promises array the get request on the exchange rate
  promises.unshift(axios(`${RATES_URL}?base=${base}`));

  try {
    // fetching responses and assinging it the money object
    const responses = await Promise.all(promises);
    const [rates] = responses;

    money.base = rates.data.base;
    money.rates = rates.data.rates;

    // building conversion options
    const conversionOpts = {
      from,
      to
    };

    // find blockchain data in response and change money rates with BTC field
    if (anyBTC) {
      const blockchain = responses.find(response =>
        response.data.hasOwnProperty(base)
      );

      Object.assign(money.rates, {
        BTC: blockchain.data[base].last
      });
    }

    // invert direction of conversion if we have 'BTC'
    if (anyBTC) {
      Object.assign(conversionOpts, {
        from: to,
        to: from
      });
    }

    // converts the amount of 'from' to the amount of 'to'
    return money.convert(amount, conversionOpts);
    // handles error about not found currencies, or any other sort of error related to the promises
  } catch (error) {
    throw new Error(
      "💵 Please specify a valid `from` and/or `to` currency value!"
    );
  }
};
