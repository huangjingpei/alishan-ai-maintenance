'use strict';

const DEFAULT_BUTTON_COOLDOWN_MS = 3200;
const DEFAULT_SETTLE_RETRY_MIN_WAIT_MS = 5000;
const DEFAULT_SETTLE_RETRY_EVERY_ROUNDS = 10;
function createFeedSwitchGuard(_0x2cec80 = {}) {
  const _0x535b3e = Number(_0x2cec80.buttonCooldownMs) > 0 ? Number(_0x2cec80.buttonCooldownMs) : DEFAULT_BUTTON_COOLDOWN_MS;
  const _0x13108a = Number(_0x2cec80.settleRetryMinWaitMs) > 0 ? Number(_0x2cec80.settleRetryMinWaitMs) : DEFAULT_SETTLE_RETRY_MIN_WAIT_MS;
  const _0x19a751 = Number(_0x2cec80.settleRetryEveryRounds) > 0 ? Number(_0x2cec80.settleRetryEveryRounds) : DEFAULT_SETTLE_RETRY_EVERY_ROUNDS;
  let _0x8ed8f9 = 0;
  let _0x4fed09 = false;
  return {
    noteAttempt({
      byButton = false
    } = {}) {
      _0x8ed8f9 = Date.now();
      _0x4fed09 = !!byButton;
    },
    shouldSkipButtonClick({
      force = false
    } = {}) {
      if (force) {
        return false;
      }
      if (!_0x4fed09 || !_0x8ed8f9) {
        return false;
      }
      return Date.now() - _0x8ed8f9 < _0x535b3e;
    },
    shouldRetrySettleSwitch({
      waitStart = 0,
      round = 0,
      sawSwitchProgress = false
    } = {}) {
      if (sawSwitchProgress) {
        return false;
      }
      if (!(Number(round) > 0)) {
        return false;
      }
      const _0x4d6cb2 = Number(waitStart) || 0;
      if (!_0x4d6cb2 || Date.now() - _0x4d6cb2 < _0x13108a) {
        return false;
      }
      return Number(round) % _0x19a751 === 0;
    },
    getLastAttemptAgeMs() {
      if (!_0x8ed8f9) {
        return Infinity;
      }
      return Date.now() - _0x8ed8f9;
    },
    reset() {
      _0x8ed8f9 = 0;
      _0x4fed09 = false;
    }
  };
}
module.exports = {
  createFeedSwitchGuard: createFeedSwitchGuard,
  DEFAULT_BUTTON_COOLDOWN_MS: DEFAULT_BUTTON_COOLDOWN_MS,
  DEFAULT_SETTLE_RETRY_MIN_WAIT_MS: DEFAULT_SETTLE_RETRY_MIN_WAIT_MS,
  DEFAULT_SETTLE_RETRY_EVERY_ROUNDS: DEFAULT_SETTLE_RETRY_EVERY_ROUNDS
};