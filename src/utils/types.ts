import { TemplateElement } from './generated/graphql'

export {
    ApplicationPayload,
    ResponsePayload,
    SectionPayload,
    TemplatePayload,
    TemplateSectionPayload
}

interface ApplicationPayload {
    serialNumber: number
    template: TemplatePayload
}

interface ResponsePayload {
    applicationId: number
    templateQuestions: TemplateElement[]
}
  
interface SectionPayload {
    applicationId: number
    templateSections: number[]
}

interface TemplatePayload {
    id: number
    name: string
    code: string
    description: string
    documents: Array<string>
}

interface TemplateSectionPayload {
    id: number
    code: string
    title: string
    elementsCount: number
}