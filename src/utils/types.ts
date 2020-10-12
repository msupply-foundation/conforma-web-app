export {
    ApplicationPayload,
    SectionPayload,
    TemplatePayload,
    TemplateSectionPayload
}

interface ApplicationPayload {
    serialNumber: number
    template: TemplatePayload
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