'use strict';

const DEFAULT_BUTTON_COOLDOWN_MS = 3200;
const DEFAULT_SETTLE_RETRY_MIN_WAIT_MS = 5000;
const DEFAULT_SETTLE_RETRY_EVERY_ROUNDS = 10;
function createFeedSwitchGuard(options = {}) {
  const value = Number(options.buttonCooldownMs) > 0 ? Number(options.buttonCooldownMs) : DEFAULT_BUTTON_COOLDOWN_MS;
  const value2 = Number(options.settleRetryMinWaitMs) > 0 ? Number(options.settleRetryMinWaitMs) : DEFAULT_SETTLE_RETRY_MIN_WAIT_MS;
  const value3 = Number(options.settleRetryEveryRounds) > 0 ? Number(options.settleRetryEveryRounds) : DEFAULT_SETTLE_RETRY_EVERY_ROUNDS;
  let num = 0;
  let flag = false;
  return {
    noteAttempt({
      byButton = false
    } = {}) {
      num = Date.now();
      flag = !!byButton;
    },
    shouldSkipButtonClick({
      force = false
    } = {}) {
      if (force) {
        return false;
      }
      if (!flag || !num) {
        return false;
      }
      return Date.now() - num < value;
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
      const local = Number(waitStart) || 0;
      if (!local || Date.now() - local < value2) {
        return false;
      }
      return Number(round) % value3 === 0;
    },
    getLastAttemptAgeMs() {
      if (!num) {
        return Infinity;
      }
      return Date.now() - num;
    },
    reset() {
      num = 0;
      flag = false;
    }
  };
}
module.exports = {
  createFeedSwitchGuard: createFeedSwitchGuard,
  DEFAULT_BUTTON_COOLDOWN_MS: DEFAULT_BUTTON_COOLDOWN_MS,
  DEFAULT_SETTLE_RETRY_MIN_WAIT_MS: DEFAULT_SETTLE_RETRY_MIN_WAIT_MS,
  DEFAULT_SETTLE_RETRY_EVERY_ROUNDS: DEFAULT_SETTLE_RETRY_EVERY_ROUNDS
};