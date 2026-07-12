import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useGovernance } from '../../hooks/useGovernance';
import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '../../api/settings';
import { PolicyCard } from '../../components/esg/PolicyCard';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { DatePicker } from '../../components/ui/DatePicker';
import { Skeleton } from '../../components/ui/Skeleton';
import { toast } from '../../components/ui/Toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { Shield, Plus, Calendar, FileCheck, AlertTriangle, ClipboardList } from 'lucide-react';
import { SearchBar } from '../../components/ui/SearchBar';
import { useAuthContext } from '../../context/AuthContext';

const auditSchema = zod.object({
  departmentId: zod.string().min(1, 'Department is required'),
  auditorName: zod.string().min(2, 'Auditor name is required'),
  score: zod.coerce.number().min(0).max(100, 'Score must be between 0 and 100'),
  outcome: zod.enum(['COMPLIANT', 'ACTION_REQUIRED']),
  findings: zod.string().min(5, 'Findings notes are required'),
  auditDate: zod.string().min(1, 'Audit date is required'),
});

type AuditFormValues = zod.infer<typeof auditSchema>;

export function Governance() {
  const { user } = useAuthContext();
  const { policies, acks, audits, issues, acknowledgePolicy, createAudit, isLoadingPolicies, isLoadingAudits } = useGovernance();
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [policySearch, setPolicySearch] = useState('');
  const [auditSearch, setAuditSearch] = useState('');
  const [issueSearch, setIssueSearch] = useState('');

  // Fetch departments
  const { data: deptsData } = useQuery({
    queryKey: ['gov_departments'],
    queryFn: () => settingsApi.getDepartments(),
  });

  const deptOptions = (deptsData?.data || []).map((d) => ({
    label: `${d.name} (${d.code})`,
    value: d.id,
  }));

  const isManagement = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const filteredPolicies = policies.filter((p) =>
    p.title.toLowerCase().includes(policySearch.toLowerCase()) ||
    p.description.toLowerCase().includes(policySearch.toLowerCase())
  );

  const filteredAudits = audits.filter((a) =>
    a.auditorName.toLowerCase().includes(auditSearch.toLowerCase()) ||
    a.findings.toLowerCase().includes(auditSearch.toLowerCase()) ||
    (a.department?.name || '').toLowerCase().includes(auditSearch.toLowerCase())
  );

  const filteredIssues = issues.filter((i) =>
    i.title.toLowerCase().includes(issueSearch.toLowerCase()) ||
    i.description.toLowerCase().includes(issueSearch.toLowerCase())
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AuditFormValues>({
    resolver: zodResolver(auditSchema),
    defaultValues: {
      auditDate: new Date().toISOString().split('T')[0],
      outcome: 'COMPLIANT',
    },
  });

  const onAuditSubmit = async (values: AuditFormValues) => {
    try {
      await createAudit(values);
      toast.success('Governance audit logs saved.');
      setIsAuditModalOpen(false);
      reset();
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit audit report.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center">
            <Shield className="h-8 w-8 mr-2.5 text-blue-500" />
            Governance & Compliance
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign policies, register compliance audits, and manage corrective issues.
          </p>
        </div>
      </div>

      <Tabs defaultValue="policies" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="policies">Policies & Directives</TabsTrigger>
          <TabsTrigger value="audits">Compliance Audits</TabsTrigger>
          <TabsTrigger value="issues">Risk registry</TabsTrigger>
        </TabsList>

        {/* Policies Content */}
        <TabsContent value="policies" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">Policies & Directives</h3>
            <SearchBar value={policySearch} onChange={setPolicySearch} placeholder="Search policies..." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoadingPolicies ? (
              <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
              </div>
            ) : filteredPolicies.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
                <FileCheck className="h-10 w-10 mb-3 text-muted-foreground/30" />
                <p className="text-sm font-medium">No matching policies found.</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Try adjusting your search terms.</p>
              </div>
            ) : (
              filteredPolicies.map((p) => {
                const isAcked = acks.some((ack) => ack.policyId === p.id);
                return (
                  <PolicyCard
                    key={p.id}
                    policy={p}
                    isAcknowledged={isAcked}
                    onAcknowledgeClick={() => acknowledgePolicy(p.id)}
                  />
                );
              })
            )}
          </div>
        </TabsContent>

        {/* Audits Content */}
        <TabsContent value="audits" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-foreground">Audit Register</h3>
            <div className="flex items-center space-x-3">
              <SearchBar value={auditSearch} onChange={setAuditSearch} placeholder="Search audits..." />
              {isManagement && (
                <Button onClick={() => setIsAuditModalOpen(true)} className="flex items-center space-x-1.5">
                  <Plus className="h-4.5 w-4.5" />
                  <span>Log Audit</span>
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {isLoadingAudits ? (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : filteredAudits.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <ClipboardList className="h-8 w-8 mb-2 text-muted-foreground/30" />
                <p className="text-sm font-medium">{auditSearch ? 'No matching audits found.' : 'No compliance audits recorded yet.'}</p>
                <p className="text-xs text-muted-foreground/70 mt-1">{auditSearch ? 'Try adjusting your search terms.' : 'Management can log audits to track department compliance.'}</p>
              </div>
            ) : (
              filteredAudits.map((a) => (
                <div key={a.id} className="p-4 bg-card border border-border rounded-xl flex items-center justify-between shadow-sm">
                  <div>
                    <h5 className="text-sm font-semibold text-foreground">Audited by: {a.auditorName}</h5>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Scope: {a.department?.name || 'Global'} &bull; Date: {new Date(a.auditDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-foreground/80 mt-1.5 italic font-medium line-clamp-2">&quot;{a.findings}&quot;</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black block text-foreground">{a.score}</span>
                    <span className="text-[9px] font-bold uppercase text-muted-foreground">{a.outcome}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        {/* Issues Content */}
        <TabsContent value="issues" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">Risk & Non-Compliance issues</h3>
            <SearchBar value={issueSearch} onChange={setIssueSearch} placeholder="Search issues..." />
          </div>
          <div className="space-y-4">
            {filteredIssues.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mb-2 text-emerald-500" />
                <p className="text-sm font-medium">{issueSearch ? 'No matching issues found.' : 'No compliance issues registered.'}</p>
                <p className="text-xs text-muted-foreground/70 mt-1">{issueSearch ? 'Try adjusting your search terms.' : 'All governance checks are passing — great work!'}</p>
              </div>
            ) : (
              filteredIssues.map((issue) => (
                <div key={issue.id} className="p-4 bg-card border border-border rounded-xl flex justify-between items-center shadow-sm">
                  <div>
                    <h5 className="text-sm font-bold text-foreground">{issue.title}</h5>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{issue.description}</p>
                    <span className="text-[10px] text-muted-foreground flex items-center space-x-1 mt-1.5">
                      <Calendar className="h-3 w-3" />
                      <span>Due: {new Date(issue.dueDate).toLocaleDateString()}</span>
                    </span>
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                    issue.status === 'OPEN' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  }`}>
                    {issue.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Log Audit Modal */}
      <Modal isOpen={isAuditModalOpen} onClose={() => setIsAuditModalOpen(false)} title="Record Compliance Audit">
        <form onSubmit={handleSubmit(onAuditSubmit)} className="space-y-4 pt-2">
          <Select
            label="Audited Department"
            options={[{ label: 'Select Department...', value: '' }, ...deptOptions]}
            error={errors.departmentId?.message}
            {...register('departmentId')}
          />

          <Input
            label="Auditor Full Name"
            placeholder="Johnathan Smith"
            error={errors.auditorName?.message}
            {...register('auditorName')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Evaluation Score (0-100)"
              type="number"
              placeholder="95"
              error={errors.score?.message}
              {...register('score')}
            />
            <Select
              label="Audit Outcome"
              options={[
                { label: 'Compliant', value: 'COMPLIANT' },
                { label: 'Action Required', value: 'ACTION_REQUIRED' },
              ]}
              error={errors.outcome?.message}
              {...register('outcome')}
            />
          </div>

          <Textarea
            label="Findings Summary"
            placeholder="Document all guidelines verified and any policy exceptions observed..."
            error={errors.findings?.message}
            {...register('findings')}
          />

          <DatePicker
            label="Audit Date"
            error={errors.auditDate?.message}
            {...register('auditDate')}
          />

          <div className="flex items-center space-x-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsAuditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={isSubmitting}>
              Record Audit
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Governance;
