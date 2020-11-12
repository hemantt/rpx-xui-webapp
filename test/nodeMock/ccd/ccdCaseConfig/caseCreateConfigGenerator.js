const textField = require('./textField');
const YesOrNo = require('./yesNoField');


const configTemplate = {
    "id": "FR_solicitorCreate",
    "name": "EXUI Test CaseType",
    "description": "Create an application for EXUI Test Casetype 1",
    "case_id": null,
    "case_fields": [],
    "event_token": "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJpcTlxNWs5NW85cWllNTk5NnU1MmEyNGhqYiIsInN1YiI6IjQxYTkwYzM5LWQ3NTYtNGViYS04ZTg1LTViNWJmNTZiMzFmNSIsImlhdCI6MTU5NjU0NzA2NSwiZXZlbnQtaWQiOiJGUl9zb2xpY2l0b3JDcmVhdGUiLCJjYXNlLXR5cGUtaWQiOiJGaW5hbmNpYWxSZW1lZHlDb250ZXN0ZWQiLCJqdXJpc2RpY3Rpb24taWQiOiJESVZPUkNFIiwiY2FzZS12ZXJzaW9uIjoiYmYyMWE5ZThmYmM1YTM4NDZmYjA1YjRmYTA4NTllMDkxN2IyMjAyZiJ9.QXtddQWsWbl8H8tKvM-SViK-E9JrFeU6bS0wlt5eJ0o",
    "wizard_pages": [ ],
    "show_summary": true,
    "show_event_notes": false,
    "end_button_label": null,
    "can_save_draft": null,
    "_links": {
        "self": {
            "href": "http://gateway-ccd.aat.platform.hmcts.net/internal/case-types/FinancialRemedyContested/event-triggers/FR_solicitorCreate?ignore-warning=false"
        }
    }
}

const wizardPageTemplate = {
    "id": 'page1',
    "label": null,
    "order": 1,
    "wizard_page_fields": [],
    "show_condition": null,
    "callback_url_mid_event": "http://finrem-cos-aat.service.core-compute-aat.internal/case-orchestration/contested/set-defaults",
    "retries_timeout_mid_event": []
};


function getCaseConfig(){
    return 
}

class CCDCaseConfig{

    caseConfigTemplate = JSON.parse(JSON.stringify(configTemplate));
   
    constructor(id, name, description){
        this.caseConfigTemplate.id = id;
        this.caseConfigTemplate.name = name;
        this.caseConfigTemplate.description = description;
    }
    
    addWizardPage(id, label, order){
        let wizardPage = JSON.parse(JSON.stringify(wizardPageTemplate));
        wizardPage.id = id;
        wizardPage.label = label;
        wizardPage.order = order;
        this.caseConfigTemplate.wizard_pages.push(wizardPage);

    }

    async addFieldToPage(pageId, caseField, order){
        let page = this.getWizardPage(pageId);
        this.caseConfigTemplate.case_fields.push(caseField);
        page.wizard_page_fields.push({
            "case_field_id": caseField.id,
            "order": order,
            "page_column_no": 1,
            "complex_field_overrides": []
        });
    }

    getWizardPage(pageId){
        let wizardPages = this.caseConfigTemplate.wizard_pages.filter(page => page.id === pageId);
        // expect(wizardPages.length,"Wizard page matching given id is not equal 1").to.equal(1);
        return wizardPages[0]; 
    }

    getTextFieldTemplate(){
        return JSON.parse(JSON.stringify(textField));
    }

    getYesOrNoFieldTemplate() {
        return JSON.parse(JSON.stringify(YesOrNo));
    }


}

module.exports = CCDCaseConfig;


