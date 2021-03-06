import { Pact } from '@pact-foundation/pact'
import { assert, expect } from 'chai'
import * as getPort from 'get-port'
import * as path from 'path'

import { EnhancedRequest } from '../../../lib/models'
import { handleTaskPost } from '../../../workAllocation/taskService'

interface Payload {
  behaviour?: string,
  assignee: any
}

describe('Work Allocation API', () => {

  let mockServerPort: number
  let provider: Pact

  const ASSIGNEE: any = { id: '987654', userName: 'bob' }
  const BEHAVIOURS = {
    SUCCESS: {},
    ALREADY_DONE: { behaviour: 'already-done' },
    BAD_REQUEST: { behaviour: 'bad-request' },
    FORBIDDEN: { behaviour: 'forbidden' },
    UNSUPPORTED: { behaviour: 'unsupported' },
    SERVER_ERROR: { behaviour: 'unsupported' }
  }

  function getPayload(behaviour: { behaviour?: string }): Payload {
    return { ...behaviour, assignee: { ...ASSIGNEE } }
  }

  before(async () => {
    mockServerPort = await getPort()
    provider = new Pact({
      consumer: 'xui_work_allocation_task_cancel',
      provider: 'WorkAllocation_api_cancel',
      dir: path.resolve(__dirname, '../pacts'),
      log: path.resolve(__dirname, '../logs', 'work-allocation.log'),
      logLevel: 'info',
      port: mockServerPort,
      spec: 2
    })
    return provider.setup()
  })

  // Write Pact when all tests done
  after(() => provider.finalize())

  describe('when requested to cancel a task', () => {
    before(() =>
      provider.addInteraction({
        state: 'task is cancelled',
        uponReceiving: 'a request for cancellation',
        withRequest: {
          method: 'POST',
          path: '/task/123456/cancel',
          body: getPayload(BEHAVIOURS.SUCCESS)
        },
        willRespondWith: {
          status: 200,
          headers: {'Content-Type': 'application/json'}
        }
      })
    )

    it('returns success with a 200', async () => {
      const taskUrl: string = `${provider.mockService.baseUrl}/task/123456/cancel`
      const payload: any = getPayload(BEHAVIOURS.SUCCESS)
      const { status } = await handleTaskPost(taskUrl, payload, {} as EnhancedRequest)
      expect(status).equal(200)
    })
  })

  describe('when requested to cancel a task that is already cancel', () => {
    before(() =>
      provider.addInteraction({
        state: 'task was already cancel',
        uponReceiving: 'a request for cancellation when already cancel',
        withRequest: {
          method: 'POST',
          path: '/task/123456/cancel',
          body: getPayload(BEHAVIOURS.ALREADY_DONE)
        },
        willRespondWith: {
          status: 204,
          headers: {'Content-Type': 'application/json'}
        }
      })
    )

    it('returns success but with a 204', async () => {
      const taskUrl: string = `${provider.mockService.baseUrl}/task/123456/cancel`
      const payload: any = getPayload(BEHAVIOURS.ALREADY_DONE)
      const { status } = await handleTaskPost(taskUrl, payload, {} as EnhancedRequest)
      expect(status).equal(204)
    })
  })

  describe('when making a bad request to cancel a task', () => {
    before(() =>
      provider.addInteraction({
        state: 'a bad request was made',
        uponReceiving: 'a bad request for cancellation',
        withRequest: {
          method: 'POST',
          path: '/task/123456/cancel',
          body: getPayload(BEHAVIOURS.BAD_REQUEST)
        },
        willRespondWith: {
          status: 400,
          headers: {'Content-Type': 'application/json'}
        }
      })
    )

    it('returns failure with a 400', async () => {
      const taskUrl: string = `${provider.mockService.baseUrl}/task/123456/cancel`
      const payload: any = getPayload(BEHAVIOURS.BAD_REQUEST)
      let response: { status: number }
      try {
        response = await handleTaskPost(taskUrl, payload, {} as EnhancedRequest)
      } catch (err) {
        response = err
      }
      assert.isDefined(response)
      expect(response.status).equal(400)
    })
  })

  describe('when making a request to cancel a forbidden task', () => {
    before(() =>
      provider.addInteraction({
        state: 'cancellation of this task is was forbidden',
        uponReceiving: 'a request for cancellation of a forbidden task',
        withRequest: {
          method: 'POST',
          path: '/task/123456/cancel',
          body: getPayload(BEHAVIOURS.FORBIDDEN)
        },
        willRespondWith: {
          status: 403,
          headers: {'Content-Type': 'application/json'}
        }
      })
    )

    it('returns failure with a 403', async () => {
      const taskUrl: string = `${provider.mockService.baseUrl}/task/123456/cancel`
      const payload: any = getPayload(BEHAVIOURS.FORBIDDEN)
      let response: { status: number }
      try {
        response = await handleTaskPost(taskUrl, payload, {} as EnhancedRequest)
      } catch (err) {
        response = err
      }
      assert.isDefined(response)
      expect(response.status).equal(403)
    })
  })

  describe('when making a request to cancel a task but it is unsupported', () => {
    before(() =>
      provider.addInteraction({
        state: 'this action is unsupported',
        uponReceiving: 'a request for cancellation but it is unsupported',
        withRequest: {
          method: 'POST',
          path: '/task/123456/cancel',
          body: getPayload(BEHAVIOURS.UNSUPPORTED)
        },
        willRespondWith: {
          status: 415,
          headers: {'Content-Type': 'application/json'}
        }
      })
    )

    it('returns failure with a 415', async () => {
      const taskUrl: string = `${provider.mockService.baseUrl}/task/123456/cancel`
      const payload: any = getPayload(BEHAVIOURS.UNSUPPORTED)
      let response: { status: number }
      try {
        response = await handleTaskPost(taskUrl, payload, {} as EnhancedRequest)
      } catch (err) {
        response = err
      }
      assert.isDefined(response)
      expect(response.status).equal(415)
    })
  })

  describe('when making a request to cancel a task and the server falls over', () => {
    before(() =>
      provider.addInteraction({
        state: 'the server had an internal error',
        uponReceiving: 'a request for cancellation and the server falls over',
        withRequest: {
          method: 'POST',
          path: '/task/123456/cancel',
          body: getPayload(BEHAVIOURS.SERVER_ERROR)
        },
        willRespondWith: {
          status: 500,
          headers: {'Content-Type': 'application/json'}
        }
      })
    )

    it('returns failure with a 500', async () => {
      const taskUrl: string = `${provider.mockService.baseUrl}/task/123456/cancel`
      const payload: any = getPayload(BEHAVIOURS.SERVER_ERROR)
      let response: { status: number }
      try {
        response = await handleTaskPost(taskUrl, payload, {} as EnhancedRequest)
      } catch (err) {
        response = err
      }
      assert.isDefined(response)
      expect(response.status).equal(500)
    })
  })

})
