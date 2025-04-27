"use client"

import { LayoutDashboard, Users, Star } from "lucide-react"
import { api } from "~/trpc/react"
import { MetricCard } from "./_components/dashboard/MetricCard"

export default function Home() {
  const { data, isLoading } = api.programs.getDashboardMetrics.useQuery()

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  if (!data) {
    return <div className="p-6">Something went wrong</div>
  }

  return (
    <div className="space-y-8 p-6">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Total Programs"
          value={data.totalPrograms}
          icon={LayoutDashboard}
          trend={data.totalPrograms ?? 0}
        />
        <MetricCard
          title="Total Clients"
          value={data.totalClients}
          icon={Users}
          trend={data.totalClients ?? 0}
        />
        <MetricCard
          title="Total Reviews"
          value={data.totalReviews}
          icon={Star}
          trend={data.totalReviews ?? 0}
        />
      </div>


      <div>
        <h2 className="text-xl font-bold mb-4">Top Programs by Enrollment</h2>
        <div className="bg-white rounded-xl shadow p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="pb-2">Program Name</th>
                <th className="pb-2">Total Clients</th>
              </tr>
            </thead>
            <tbody>
              {data.topProgramsByEnrollment.map((program) => (
                <tr key={program.name} className="border-t">
                  <td className="py-2">{program.name}</td>
                  <td className="py-2">{program.totalClients}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
