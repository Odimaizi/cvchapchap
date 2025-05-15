import { Card, CardContent } from "@/components/ui/card"

interface ResumeData {
  title: string
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  experiences: Array<{
    company: string
    position: string
    startDate: string
    endDate: string
    description: string
  }>
  education: Array<{
    institution: string
    degree: string
    startDate: string
    endDate: string
  }>
  skills: string
}

interface ResumePreviewProps {
  data: ResumeData
  template: string
}

export function ResumePreview({ data, template }: ResumePreviewProps) {
  const renderTemplate = () => {
    switch (template) {
      case "template1":
        return <ModernTemplate data={data} />
      case "template2":
        return <ClassicTemplate data={data} />
      case "template3":
        return <CreativeTemplate data={data} />
      default:
        return <ModernTemplate data={data} />
    }
  }

  return (
    <Card>
      <CardContent className="p-6">{renderTemplate()}</CardContent>
    </Card>
  )
}

function ModernTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="font-sans">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">
          {data.firstName} {data.lastName}
        </h1>
        <p className="text-xl text-gray-600">{data.title}</p>
        <div className="mt-2 text-sm text-gray-500">
          <p>
            {data.email} | {data.phone} | {data.location}
          </p>
        </div>
      </header>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Experience</h2>
        {data.experiences.map((exp, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-lg font-medium">{exp.position}</h3>
            <p className="text-gray-600">{exp.company}</p>
            <p className="text-sm text-gray-500">
              {exp.startDate} - {exp.endDate}
            </p>
            <p className="mt-2">{exp.description}</p>
          </div>
        ))}
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Education</h2>
        {data.education.map((edu, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-lg font-medium">{edu.degree}</h3>
            <p className="text-gray-600">{edu.institution}</p>
            <p className="text-sm text-gray-500">
              {edu.startDate} - {edu.endDate}
            </p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">Skills</h2>
        <p>{data.skills}</p>
      </section>
    </div>
  )
}

function ClassicTemplate({ data }: { data: ResumeData }) {
  // Implement the classic template
  return <div>Classic Template (To be implemented)</div>
}

function CreativeTemplate({ data }: { data: ResumeData }) {
  // Implement the creative template
  return <div>Creative Template (To be implemented)</div>
}
