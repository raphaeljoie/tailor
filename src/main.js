import { ekwal as compare } from 'ekwal';

const isNumber = (x) => Object.prototype.toString.call(x) === '[object Number]';
const isString = (x) => typeof x === 'string' || x instanceof String;

const newStage = (stageFactory, ref, initParams) => ({
  prepare: stageFactory,
  id: isString(ref) ? ref : null,
  params: initParams,
});

export function tailor(o) {
  const options = o || {};
  const stages = [];
  let rescuer = null;
  const lastInput = void 0;

  const base = {};
  base.stage = stageFn;
  base.getStageIndex = getStageIndexFn;
  base.rescue = rescueFn;
  base.prepare = prepareFn;
  base.isReady = isReadyFn;
  base.feed = feed;
  base.reFeed = () => base.feed(lastInput, true);
  base.length = () => stages.length;
  base.stageAfter = stageAfter;
  base.stageBefore = stageBefore;
  base.params = (ref, params) => {
    const s = stages[getStageIndexFn(ref)];

    s.params = params;
    s.stage = null;
    s.lastOutcome = void 0;
  };
  base.unstage = (ref) => {}; // TODO

  return base;

  function getStageIndexFn(ref) {
    if (ref == null) return -1;
    if (Number.isInteger(ref)) {
      // id is a number, an index in the list
      return (ref >= 0 && ref < base.length()) ? ref : -1;
    } if (isString(ref)) {
      return stages.findIndex((s) => s.id === ref);
    } return stages.findIndex((s) => s.prepare === ref);
  }

  function stageAfter(refId, stageFactory, id, initParams) {
    const refStageIx = getStageIndexFn(refId);
    stages.splice(refStageIx + 1, 0, newStage(stageFactory, id, initParams));
    return base;
  }

  function stageBefore(nextRef, stageFactory, ref, initParams) {
    const nextStageIx = getStageIndexFn(nextRef);
    if (nextStageIx === -1) throw new Error(`Unknown stage with reference ${nextRef}`);
    stages.splice(nextStageIx, 0, newStage(stageFactory, ref, initParams));
    return base;
  }

  function rescueFn(b) {
    rescuer = b;
    return base;
  }

  function prepareFn() {
    return Promise.all(stages.map((s) => Promise.resolve()
      .then(async () => {
        s.stage ||= await s.prepare(s.params);
        if (!s.stage) throw new Error('Stage factory didn\'t return anything');
      })));
  }

  function isReadyFn() {
    return !stages.find((s) => !s.stage);
  }

  function stageFn(stageFactory, ref, initParams) {
    const s = newStage(stageFactory, ref, initParams);
    const stageIx = getStageIndexFn(ref);
    if (stageIx === -1 && isNumber(ref)) throw new Error('');
    if (stageIx === -1) stages.push(s);
    else stages[stageIx] = s;
    return base;
  }

  // TODO Allow on the fly prepare
  // TODO check race condition init
  function feed(initInput, force = false) {
    const somethingChanged = force || compare(initInput, lastInput);
    return stages.reduce((acc, s) => acc.then(async ({ input: stageInput }) => {
      if (!somethingChanged && s.lastOutput !== undefined) {
        return { output: s.lastOutput, params: s.params };
      }
      try {
        const payload = {
          initInput,
          input: stageInput,
        }
        return {
          output: await ((s.stage.transpose && s.stage.transpose(payload)) || s.stage(payload)),
          params: s.params,
        };
      } catch (e) {
        if (rescuer) {
          rescuer({
            error: e,
            stage: s.prepare,
            params: s.params,
            initInput,
          });
        }
        throw { error: e, stageFactory: s.prepare, params: s.params };
      }
    }).then(({ output, params }) => {
      // If parameters of stage has not changed in the meantime, keep the output in cache
      if (options.cache && s.params === params) {
        s.lastOutput = output;
      }
      return { initInput, input: output };
    }), prepareFn().then(() => ({ initInput, input: initInput })));
  }
}
