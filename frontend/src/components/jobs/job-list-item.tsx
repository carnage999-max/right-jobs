import Link from "next/link";
import { Briefcase, Clock, DollarSign, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { jobPath } from "@/lib/seo/site";

type Item = { id: string; title: string; companyName: string; location: string; type: string; salaryRange: string | null; salaryType: string; createdAt: Date };

/** One job in a list on a server-rendered page: a real link to the canonical job URL. */
export function JobListItem({ job }: { job: Item }) {
  return (
    <li className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/50 border border-slate-100">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h3 className="text-xl font-black tracking-tight text-slate-900">
            <Link href={jobPath(job)} className="hover:text-primary hover:underline underline-offset-4">
              {job.title}
            </Link>
          </h3>
          <p className="flex items-center gap-2 font-bold text-slate-700">
            <Briefcase className="h-4 w-4 text-primary" aria-hidden /> {job.companyName}
          </p>
          <p className="flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" aria-hidden /> {job.location}
            </span>
            {job.salaryRange ? (
              <span className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4" aria-hidden /> {job.salaryRange} / {job.salaryType.replace("LY", "").toLowerCase()}
              </span>
            ) : null}
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden /> {formatDate(job.createdAt)}
            </span>
          </p>
        </div>
        <Badge className="self-start bg-slate-100 text-slate-900 border-none py-1.5 px-4 rounded-xl text-xs font-black tracking-widest uppercase md:self-center">{job.type.replace("_", " ")}</Badge>
      </div>
    </li>
  );
}
