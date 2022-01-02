# Tailor
> A highly flexible and modular way to chain time-consuming tasks
> with cached intermediate results for even faster delivery!
```js
// !! PSEUDO CODE !! \\
const slowStageFactory = 'takes 3" to prepare a 5" stage'
const fastStageFactory = 'takes 2" to prepare a 1" stage'

// Real life code
t = tailor()
  .stage('#1', slowStageFactory, {params})
  .stage('#2', fastStageFactory, {params});

await t.feed(1) // 3" + 2" + 5" + 1"
await t.feed(1) // 0", nothing changed
await t.feed(2) // 5" + 1", only input changed
await t.reFeed() // 0", nothing changed
await t.params('#2', {newParams}).reFeed() // 2" + 1"
await t.stage('#2', slowStageFactory, {}).reFeed() // 3" + 5"
await t.params('#1', {newParams}).reFeed() // 3" + 3" + 5" + 5"
```

```js
// a stage is prepared by a stage factory and is made of a function 
// taking an input as a parameter, returning an interesting output
const stageFactory = async (params) => {
    // do something great to prepare the stage
    await sleep(1);  // wait 1 sec
    const k = params.k;
    // and return the stage function itself
    return async ({initInput, input}) => {
        // This stages takes the input and multiplies it by 10
        // after 1 sec
        await sleep(1);  // wait 1 sec
        return input * k;
    }
}


const t = tailor()
  .stage(stageFactory, 'first', {k: 10})
  .stage(() => ({input}) => input, 'justForward')
  .rescue(({error, initInput, params, stageFactory}) => console.error(error))

// takes 2 sec. 1" to prepare first stage + 1" to process input
t.feed(10).then((out) => { console.log(out) }) // => 10 * 10
// Nothing changed, nothing is re-processed => takes few ms!
t.reFeed().then((out) => { console.log(out) }) // => 10 * 10
// Stage params didn't change, no need to reconfigure it
// => only 1" to process input
t.feed(1).then((out) => { console.log(out) }) // => 1 * 10
// params of first stage changed. Takes again 2"
t.stageParams('first', {k: 100})
  .reFeed()
  .then((out) => { console.log(out) }) // => 1 * 10
// only second stage is changed. Result of first stage was cached
// and only 2" is needed to prepare and process stage 2
t.stage(stageFactory, 'justForward', {k: 2})
  reFeed().then((out)) // 1 * 10 * 2
```
