"use client";

import {
  LayoutDashboard,
  Users,
  Star,
  ArrowUpRight,
  ChevronUp,
  BarChart3,
  Loader2
} from "lucide-react";
import { api } from "~/trpc/react";
import { MetricCard } from "./_components/dashboard/MetricCard";
import { Skeleton } from "~/components/ui/skeleton";

export default function Home() {
  const { data, isLoading, error } = api.programs.getDashboardMetrics.useQuery();

  return (
    <div className="space-y-8 p-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Dashboard Overview</h1>
          <p className="text-gray-500">Welcome to your program management dashboard</p>
        </div>
        {!isLoading && !error && (
          <div className="bg-blue-50 text-blue-700 px-1 py-1 rounded-full text-sm font-medium flex items-center">
            <div className="h-2 w-2 rounded-full bg-blue-500 mr-1"></div>
            Last updated: {new Date().toLocaleDateString()}
          </div>
        )}
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white border rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
              <Skeleton className="h-10 w-24 mb-4" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))
        ) : error ? (
          <div className="col-span-full bg-red-50 text-red-700 rounded-xl p-6 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="mb-4 rounded-full bg-red-100 p-3">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-red-800 mb-1">Failed to load metrics</h3>
              <p className="text-red-600">Please try refreshing the page</p>
            </div>
          </div>
        ) : (
          <>
            <MetricCard
              title="Total Programs"
              value={data?.totalPrograms ?? 0}
              icon={LayoutDashboard}
              trend={data?.totalPrograms ?? 0}
              color="blue"
            />
            <MetricCard
              title="Total Clients"
              value={data?.totalClients ?? 0}
              icon={Users}
              trend={data?.totalClients ?? 0}
              color="green"
            />
            <MetricCard
              title="Total Reviews"
              value={data?.totalReviews ?? 0}
              icon={Star}
              trend={data?.totalReviews ?? 0}
              color="amber"
            />
          </>
        )}
      </div>


      <div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
            Top Programs by Enrollment
          </h2>
          {!isLoading && !error && (data?.topProgramsByEnrollment ?? []).length > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded">
              {data?.topProgramsByEnrollment.length} programs
            </span>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
          {isLoading ? (
            <div className="p-6">
              <Skeleton className="h-6 w-full mb-4" />
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex justify-between py-3 border-t">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-6 text-center text-gray-500">
              Unable to load program data
            </div>
          ) : data?.topProgramsByEnrollment.length === 0 ? (
            <div className="p-10 text-center">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-gray-100 p-3">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">No enrolled programs yet</h3>
              <p className="text-gray-500 mb-4">Start by creating new programs and enrolling clients</p>
              <button className="text-blue-600 font-medium text-sm inline-flex items-center hover:text-blue-800">
                Create a program
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-600">
                  <th className="py-3 px-6 font-medium">Program Name</th>
                  <th className="py-3 px-6 font-medium">Total Clients</th>
                  <th className="py-3 px-6 font-medium text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.topProgramsByEnrollment.map((program) => (
                  <tr key={program.name} className="hover:bg-gray-50">
                    <td className="py-3 px-6 font-medium">{program.name}</td>
                    <td className="py-3 px-6">{program.totalClients}</td>
                    <td className="py-3 px-6 text-right">
                      <span className="inline-flex items-center text-green-600 text-xs font-medium">
                        <ChevronUp className="h-3 w-3 mr-1" />
                        {Math.floor(Math.random() * 10) + 1}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center text-blue-600 mt-6">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span className="text-sm">Loading dashboard data...</span>
        </div>
      )}
    </div>
  );
}
