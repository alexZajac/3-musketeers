const nock = require("nock");
const currency = require("./");

// Constants stubs for tests
const BASE_ERROR =
  "💵 Please specify a valid `from` and/or `to` currency value!";
const USD_EUR = 0.899;
const EUR_EUR = 1;
const EUR_USD = 1.1122;
const BTC_USD = 8944.49;
const BTC_EUR = 8048.11;

// nock provides mocking for HTTP requests, here we mock received exchange rates to constant values for testing
beforeEach(() => {
  nock("https://api.exchangeratesapi.io")
    .get("/latest?base=USD")
    .reply(200, {
      base: "USD",
      rates: {
        EUR: USD_EUR
      }
    });

  nock("https://api.exchangeratesapi.io")
    .get("/latest?base=EUR")
    .reply(200, {
      base: "EUR",
      rates: {
        USD: EUR_USD
      }
    });

  nock("https://blockchain.info")
    .get("/ticker")
    .reply(200, {
      USD: {
        "15m": BTC_USD,
        last: BTC_USD,
        buy: BTC_USD,
        sell: BTC_USD,
        symbol: "$"
      },
      EUR: {
        "15m": BTC_EUR,
        last: BTC_EUR,
        buy: BTC_EUR,
        sell: BTC_EUR,
        symbol: "€"
      }
    });
});

/* JEST TESTS
   Each test follows the same structure: 
   - Arrange the data for the given test
   - Act, get the mocked value from the API
   - Assert, compare them with constants previously defined
*/

test("convert 1 USD to EUR", async () => {
  const amount = 1,
    from = "USD",
    to = "EUR";
  const opts = { amount, from, to };
  const result = await currency(opts);
  expect(result).toBe(USD_EUR);
});

test("convert 1 USD to USD", async () => {
  const amount = 1,
    from = "EUR",
    to = "EUR";
  const opts = { amount, from, to };
  const result = await currency(opts);
  expect(result).toBe(EUR_EUR);
});

test("convert 1 EUR to USD", async () => {
  const amount = 1,
    to = "USD",
    from = "EUR";
  const opts = { amount, from, to };
  const result = await currency(opts);
  expect(result).toBe(EUR_USD);
});

test("convert 1 BTC to USD", async () => {
  const amount = 1,
    from = "BTC",
    to = "USD";
  const opts = { amount, from, to };
  const result = await currency(opts);
  expect(result).toBe(BTC_USD);
});

test("convert 1 BTC to EUR", async () => {
  const amount = 1,
    from = "BTC",
    to = "EUR";
  const opts = { amount, from, to };
  const result = await currency(opts);
  expect(result).toBe(BTC_EUR);
});

test("convert without arguments", async () => {
  // here the default is 1 USD to BTC
  const opts = {};
  const result = await currency(opts);
  expect(result).toBe(1 / BTC_USD);
});

test("convert with amount only", async () => {
  // here the default is 1 USD to BTC
  const amount = 3;
  const opts = { amount };
  const result = await currency(opts);
  expect(result).toBe(amount / BTC_USD);
});

test("convert with amount and (from) currency only", async () => {
  // here the default is 1 USD to BTC
  const amount = 4,
    from = "USD";
  const opts = { amount, from };
  const result = await currency(opts);
  expect(result).toBe(amount / BTC_USD);
});

test("convert without a correct `from` or `to` currency value", () => {
  const amount = 1,
    from = "LIBRA",
    to = "CORONACOIN";
  const opts = { amount, from, to };
  return currency(opts).catch(e => expect(e.message).toMatch(BASE_ERROR));
});
