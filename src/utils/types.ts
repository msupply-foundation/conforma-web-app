export {
    ApplicationPayload,
    SectionPayload,
    TemplateTypePayload,
    TemplateSectionPayload
}

interface ApplicationPayload {
    serialNumber: number
    template: TemplateTypePayload
}
  
interface SectionPayload {
    applicationId: number
    templateSections: number[]
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