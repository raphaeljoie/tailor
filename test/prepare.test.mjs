import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import tailor from '../src/main.js';
chai.use(chaiAsPromised)

describe('tailor()', () => {
  describe('#prepare()', () => {
    it('successfully build stage', (done) => {
      tailor()
        .stage(async (params) => {
          done()
          return async (input) => ({});
        }, {})
        .prepare();
    })
    it('successfully complete', (done) => {
      tailor()
        .stage(async (params) => async (input) => ({}), {})
        .prepare()
        .then(() => done());
    })
    it('fails if something is wrong', async () => {
      await chai.expect(tailor()
          .stage(async (params) => {
            throw Error('');
          }, {})
          .prepare()).to.be.rejectedWith(Error)
    });
    it('fails stageFactory doesn\' return anything', async () => {
      await chai.expect(tailor()
        .stage(async (params) => {})
        .prepare()).to.be.rejectedWith(Error)
    });
    it('only stageFactory.prepare() once', async () => {
      let prepareCount = 0;
      const t = tailor().stage(async (params) => {prepareCount += 1; return () => {}});
      await t.prepare();
      await t.prepare();
      chai.assert.equal(prepareCount, 1);
    })
  })
});
