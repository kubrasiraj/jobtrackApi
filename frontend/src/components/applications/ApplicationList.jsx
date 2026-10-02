import { Link } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';
import { formatDate, formatSalary } from '../../utils/format';

function Actions({ application, onEdit, onDelete }) {
  return (
    <div className="flex justify-end gap-1">
      <Button variant="ghost" size="icon" aria-label={`Edit ${application.job_title}`} onClick={() => onEdit(application)}><Pencil className="h-4 w-4" /></Button>
      <Button variant="danger-ghost" size="icon" aria-label={`Delete ${application.job_title}`} onClick={() => onDelete(application)}><Trash2 className="h-4 w-4" /></Button>
    </div>
  );
}

export default function ApplicationList({ applications, companyName, onEdit, onDelete }) {
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/60 text-xs font-medium uppercase tracking-wide text-slate-500">
            <tr>
              <th scope="col" className="px-5 py-3">Job title</th>
              <th scope="col" className="px-5 py-3">Company</th>
              <th scope="col" className="px-5 py-3">Type</th>
              <th scope="col" className="px-5 py-3">Status</th>
              <th scope="col" className="px-5 py-3">Applied</th>
              <th scope="col" className="px-5 py-3 text-right">Salary</th>
              <th scope="col" className="px-5 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {applications.map((application) => (
              <tr key={application.id} className="hover:bg-slate-50/60">
                <td className="px-5 py-3.5">
                  <Link to={`/applications/${application.id}`} className="font-medium text-slate-900 hover:text-brand-600">{application.job_title}</Link>
                </td>
                <td className="px-5 py-3.5 text-slate-600">{companyName(application.company_id)}</td>
                <td className="px-5 py-3.5 text-slate-600">{application.job_type}</td>
                <td className="px-5 py-3.5"><StatusBadge status={application.status} /></td>
                <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">{formatDate(application.applied_date)}</td>
                <td className="px-5 py-3.5 text-right tabular-nums text-slate-600">{formatSalary(application.salary)}</td>
                <td className="px-5 py-3.5"><Actions application={application} onEdit={onEdit} onDelete={onDelete} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-slate-100 md:hidden">
        {applications.map((application) => (
          <li key={application.id} className="px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link to={`/applications/${application.id}`} className="block truncate font-medium text-slate-900">{application.job_title}</Link>
                <p className="truncate text-sm text-slate-500">{companyName(application.company_id)} · {application.job_type}</p>
              </div>
              <StatusBadge status={application.status} />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Applied {formatDate(application.applied_date)}
                {application.salary !== null && <> · {formatSalary(application.salary)}</>}
              </p>
              <Actions application={application} onEdit={onEdit} onDelete={onDelete} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
