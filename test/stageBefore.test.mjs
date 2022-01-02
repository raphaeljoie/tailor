import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import tailor from '../src/main.js';
chai.use(chaiAsPromised)

describe('tailor()', () => {
  describe('#stageBefore()', () => {
    it('successfully passes init params to stage factory', async () => {
      let s1, s2;
      const t = tailor()
        .stage(()=>{})
        .stage((s1 = (params) => {}), 'blabetiblou')
        .stageBefore('blabetiblou', (s2 = (params) => {}))

      chai.assert.equal(t.getStageIndex(s1), 2)
      chai.assert.equal(t.getStageIndex(s2), 1)
      chai.assert.equal(t.length(), 3)
    });
    it('successfully passes init params to stage factory', async () => {
      chai.expect(() => {
        tailor().stageBefore('blabetiblou', (params) => {})
      }).to.throw(Error);
    });
    it('successfully passes init params to stage factory', async () => {
      let s;
      const t = tailor()
        .stage(()=>{})
        .stage((params) => {},'blabetiblou')
        .stageBefore(1, (s = (params) => {}))

      chai.assert.equal(t.getStageIndex(s), 1)
      chai.assert.equal(t.length(), 3)
    });
  })
});
