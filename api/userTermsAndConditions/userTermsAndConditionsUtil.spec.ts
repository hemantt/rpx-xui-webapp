import { expect } from 'chai'
import { getUserTermsAndConditionsUrl, postUserTermsAndConditionsUrl } from './userTermsAndConditionsUtil'

describe('terms And Conditions ', () => {
    it('should getUserTermsAndConditionsUrl', () => {
        const url = getUserTermsAndConditionsUrl('http://base', 'userId1234')
        expect(url).to.equal('http://base/api/v1/termsAndConditions/managecases/users/userId1234/1')
    })

    it('should postUserTermsAndConditionsUrl', () => {
        const url = postUserTermsAndConditionsUrl('http://base')
        expect(url).to.equal('http://base/api/v1/termsAndConditions/managecases/users/1')
    })
})