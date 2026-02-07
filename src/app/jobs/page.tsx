import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Briefcase, DollarSign, Clock, Filter } from "lucide-react";
import Link from "next/link";

// Mock data for initial UI
const MOCK_JOBS = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    title: "Senior Frontend Engineer",
    companyName: "TechFlow Systems",
    location: "San Francisco, CA",
    type: "FULL_TIME",
    category: "Engineering",
    salaryRange: "$140k - $180k",
    createdAt: new Date().toISOString(),
  },
  {
    id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    title: "Product Designer",
    companyName: "CreativeBits",
    location: "Remote",
    type: "FULL_TIME",
    category: "Design",
    salaryRange: "$100k - $130k",
    createdAt: new Date().toISOString(),
  },
  {
    id: "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
    title: "Project Manager",
    companyName: "BuildIt Corp",
    location: "Austin, TX",
    type: "CONTRACT",
    category: "Management",
    salaryRange: "$80/hr",
    createdAt: new Date().toISOString(),
  }
];

export default function JobsPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex-1 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Explore Opportunities</h1>
          <p className="text-slate-600">Find the role that matches your skills and ambitions.</p>
          <div className="flex max-w-2xl gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input className="h-12 pl-10 ios-button" placeholder="Search jobs, companies, or keywords..." />
            </div>
            <Button className="h-12 px-6 ios-button">Search</Button>
          </div>
        </div>
        <Button variant="outline" className="h-12 ios-button">
          <Filter className="mr-2 h-5 w-5" /> Filters
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_3fr]">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden h-fit space-y-8 md:block">
          <div>
            <h3 className="mb-4 font-semibold">Job Type</h3>
            <div className="space-y-2">
               {["Full-time", "Part-time", "Contract", "Internship", "Remote"].map(type => (
                 <label key={type} className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary cursor-pointer">
                   <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary" />
                   {type}
                 </label>
               ))}
            </div>
          </div>
          <div>
            <h3 className="mb-4 font-semibold">Category</h3>
            <div className="space-y-2">
               {["Engineering", "Design", "Marketing", "Sales", "Management"].map(cat => (
                 <label key={cat} className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary cursor-pointer">
                   <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary" />
                   {cat}
                 </label>
               ))}
            </div>
          </div>
        </aside>

        {/* Job List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Showing {MOCK_JOBS.length} jobs</span>
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Sort by:</span>
                <select className="bg-transparent text-sm font-semibold text-primary outline-none">
                  <option>Newest First</option>
                  <option>Salary: High to Low</option>
                </select>
            </div>
          </div>

          <div className="grid gap-4">
            {MOCK_JOBS.map((job) => (
              <Card key={job.id} className="ios-card overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold hover:text-primary transition-colors cursor-pointer">
                        <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                      </CardTitle>
                      <p className="mt-1 text-sm font-medium text-slate-500">{job.companyName}</p>
                    </div>
                    <Badge variant="secondary" className="rounded-md font-medium">
                      {job.type.replace("_", " ")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4" />
                      {job.category}
                    </div>
                    {job.salaryRange && (
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="h-4 w-4" />
                        {job.salaryRange}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      Just now
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-slate-50/50 pt-4 border-t">
                  <Button asChild variant="outline" size="sm" className="ml-auto ios-button">
                    <Link href={`/jobs/${job.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
