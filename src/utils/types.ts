import { TemplateElement } from './generated/graphql'

export {
    ResponsePayload,
    SectionPayload,
    SectionPages,
    SectionPageDetails,
    TemplateTypePayload,
    TemplateSectionPayload
}

interface ResponsePayload {
    applicationId: number
    templateQuestions: TemplateElement[]
}
  
interface SectionPayload {
    applicationId: number
    templateSections: (number | null)[]
}

interface SectionPages {
    [code: string]: SectionPageDetails
}

interface SectionPageDetails {
    id: number
    code: string
    title: string
    startPage: number
    totalPages: number
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