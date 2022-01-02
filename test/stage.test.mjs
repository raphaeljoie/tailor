import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import tailor from '../src/main.js';
chai.use(chaiAsPromised)

const sleep = (x) => new Promise(((resolve) => setTimeout(resolve, x)));

describe('tailor()', () => {
  describe('#stage()', () => {
    it('fails to setup a stage at an out of bounds position', () => {
      chai.expect(() => tailor().stage(() => {}, 1)).to.throw(Error)
    });
    it('fails to setup a stage at negative position',  () => {
      chai.expect(() => tailor().stage(() => {}, -1)).to.throw(Error)
    });
    it('successfully setup a stage associated to an unknown id', async () => {
      const t = tailor().stage(() => {}, 'blabetiblou')
      chai.assert.equal(t.length(), 1)
      t.stage(() => {}, 'blabetiblou')
      chai.assert.equal(t.length(), 1)
    });
    it('successfully passes init params to stage factory', async () => {
      let stagePrepared = false;
      await tailor().stage((params) => {
        stagePrepared = true
        chai.assert.equal(params, 1234)
        return () => {}
      }, null, 1234).prepare()
      chai.assert.isOk(stagePrepared);
    });
    it('', async () => {
      let stagePrepared = false;
      class Stage {
        constructor(params) {
          this.testValue = 42
        }
        static async factory(params) {
          stagePrepared = true;
          chai.assert.equal(params, 1234)
          return new Stage()
        }
      }
      await tailor().stage(Stage.factory, null, 1234).prepare()
      chai.assert.isOk(stagePrepared);
    })
  })
});
// TODO test this in class stage transpose()
