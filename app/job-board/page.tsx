import { JobBoardClient } from "./job-board-client"

export default function JobBoardPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-4">Job Board</h1>
      <p className="text-lg mb-8">Discover job opportunities tailored to your skills and experience.</p>
      <JobBoardClient />
    </div>
  )
}
