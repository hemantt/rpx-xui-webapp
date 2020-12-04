import * as chai from 'chai'
import { expect } from 'chai'
import 'mocha'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { mockReq } from 'sinon-express-mock'
import * as amendedJurisdictions from './index'

chai.use(sinonChai)

describe('Amended Jurisdiction', () => {

  let sandbox
  let result0
  let result1
  let req

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    req = mockReq()

    result0 = {
        data: [
            {
                id: 'PROBATE',
            },
            {
                id: 'data',
            },
        ],
    }

    result1 = {
        data: [

        ],
    }

  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should send PROBATE array',  () => {
    const expected = [
        {
            id: 'PROBATE',
        },
    ]

    const response = amendedJurisdictions.getJurisdictions(req, expected)
    expect(response).to.eql(expected)
  })

  it('should send empty array', () => {
    const expected = []

      const response = amendedJurisdictions.getJurisdictions(req, expected)
      expect(response).to.eql(expected)
  })

})
