export {
    ApplicationPayload,
    SectionPayload
}

interface ApplicationPayload {
    serialNumber: string
    templateId: number
    templateName: string
  }
  
interface SectionPayload {
    applicationId: number
    templateSections: number[]
}