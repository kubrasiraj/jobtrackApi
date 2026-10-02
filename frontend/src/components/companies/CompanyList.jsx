import { ExternalLink, MapPin, Pencil, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import { displayUrl, toSafeUrl } from '../../utils/format';

function WebsiteLink({ website }) {
  const href = toSafeUrl(website);
  if (!website) return <span className="text-slate-400">—</span>;
  if (!href) return <span>{website}</span>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 hover:underline">
      <span className="max-w-[14rem] truncate">{displayUrl(website)}</span>
      <ExternalLink aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
    </a>
  );
}

function Actions({ company, onEdit, onDelete }) {
  return (
    <div className="flex justify-end gap-1">
      <Button variant="ghost" size="icon" aria-label={`Edit ${company.name}`} onClick={() => onEdit(company)}><Pencil className="h-4 w-4" /></Button>
      <Button variant="danger-ghost" size="icon" aria-label={`Delete ${company.name}`} onClick={() => onDelete(company)}><Trash2 className="h-4 w-4" /></Button>
    </div>
  );
}

export default function CompanyList({ companies, onEdit, onDelete }) {
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/60 text-xs font-medium uppercase tracking-wide text-slate-500">
            <tr>
              <th scope="col" className="px-5 py-3">Company</th>
              <th scope="col" className="px-5 py-3">Industry</th>
              <th scope="col" className="px-5 py-3">Website</th>
              <th scope="col" className="px-5 py-3">Location</th>
              <th scope="col" className="px-5 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {companies.map((company) => (
              <tr key={company.id} className="hover:bg-slate-50/60">
                <td className="px-5 py-3.5 font-medium text-slate-900">{company.name}</td>
                <td className="px-5 py-3.5 text-slate-600">{company.industry || <span className="text-slate-400">—</span>}</td>
                <td className="px-5 py-3.5"><WebsiteLink website={company.website} /></td>
                <td className="px-5 py-3.5 text-slate-600">{company.location || <span className="text-slate-400">—</span>}</td>
                <td className="px-5 py-3.5"><Actions company={company} onEdit={onEdit} onDelete={onDelete} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-slate-100 md:hidden">
        {companies.map((company) => (
          <li key={company.id} className="px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-900">{company.name}</p>
                {company.industry && <p className="text-sm text-slate-500">{company.industry}</p>}
              </div>
              <Actions company={company} onEdit={onEdit} onDelete={onDelete} />
            </div>
            <div className="mt-2 space-y-1 text-sm text-slate-600">
              {company.location && <p className="flex items-center gap-1.5"><MapPin aria-hidden="true" className="h-3.5 w-3.5 text-slate-400" />{company.location}</p>}
              {company.website && <WebsiteLink website={company.website} />}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
