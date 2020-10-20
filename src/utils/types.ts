import { TemplateElement } from './generated/graphql'

export {
    ApplicationPayload,
    ResponsePayload,
    SectionPayload,
    TemplateTypePayload,
    TemplateSectionPayload
}

interface ApplicationPayload {
    serialNumber: string
    template: TemplateTypePayload
}

interface ResponsePayload {
    applicationId: number
    templateQuestions: TemplateElement[]
}
  
interface SectionPayload {
    applicationId: number
    templateSections: (number | null)[]
}

interface TemplateTypePayload {
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