import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import tailor from '../src/main.js';
chai.use(chaiAsPromised)

const sleep = (x) => new Promise(((resolve) => setTimeout(resolve, x)));

describe('tailor()', () => {
  describe('#constructor()', () => {
    it('should return true for integers', () => {
      tailor()
    });
  })
});
