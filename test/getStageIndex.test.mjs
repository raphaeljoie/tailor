import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import tailor from '../src/main.js';

describe('tailor()', () => {
  describe('#getStageIndex()', () => {
    it('successfully setup a stage associated to an unknown id', async () => {
      chai.assert.equal(
        tailor().stage(() => {}, 'blabetiblou').getStageIndex('blabetiblou'),
        0)
    });
    it('successfully setup a stage associated to an unknown id', async () => {
      chai.assert.equal(
        tailor().getStageIndex('blabetiblou'),
        -1)
    });
    it('successfully setup a stage associated to an unknown id', async () => {
      chai.assert.equal(
        tailor().getStageIndex(0),
        -1)
    });
    it('successfully setup a stage associated to an unknown id', async () => {
      chai.assert.equal(
        tailor().getStageIndex(null),
        -1)
    });
    it('successfully setup a stage associated to an unknown id', async () => {
      chai.assert.equal(
        tailor().getStageIndex(),
        -1)
    });
    it('successfully setup a stage associated to an unknown id', async () => {
      chai.assert.equal(
        tailor().stage(() => {}, 'blabetiblou').getStageIndex(0),
        0)
    });
    it('successfully setup a stage associated to an unknown id', async () => {
      const stageFactory = () => {}
      chai.assert.equal(
        tailor().stage(stageFactory).getStageIndex(stageFactory),
        0)
    });
  })
});
