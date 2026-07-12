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
import { toast } from '../../components/ui/Toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { Shield, Plus, Calendar } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';

const auditSchema = zod.object({
  departmentId: zod.string().min(1, 'Department is required'),
  auditorName: zod.string().min(2, 'Auditor name is required'),
  score: zod.coerce.number().min(0).max(100, 'Score must be between 0 and 100'),
  outcome: zod.enum(['PASSED', 'FAILED', 'UNDER_REVIEW']),
  findings: zod.string().min(5, 'Findings notes are required'),
  auditDate: zod.string().min(1, 'Audit date is required'),
});

type AuditFormValues = zod.infer<typeof auditSchema>;

export function Governance() {
  const { user } = useAuthContext();
  const { policies, acks, audits, issues, acknowledgePolicy, createAudit, isLoadingPolicies } = useGovernance();
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AuditFormValues>({
    resolver: zodResolver(auditSchema),
    defaultValues: {
      auditDate: new Date().toISOString().split('T')[0],
      outcome: 'PASSED',
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoadingPolicies ? (
              <p className="text-sm text-muted-foreground">Loading policies...</p>
            ) : policies.length === 0 ? (
              <p className="text-sm text-muted-foreground">No governance directives issued.</p>
            ) : (
              policies.map((p) => {
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
            {isManagement && (
              <Button onClick={() => setIsAuditModalOpen(true)} className="flex items-center space-x-1.5">
                <Plus className="h-4.5 w-4.5" />
                <span>Log Audit</span>
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {audits.length === 0 ? (
              <p className="text-sm text-muted-foreground">No compliance audits recorded.</p>
            ) : (
              audits.map((a) => (
                <div key={a.id} className="p-4 bg-card border border-border rounded-xl flex items-center justify-between shadow-sm">
                  <div>
                    <h5 className="text-sm font-semibold text-foreground">Audited by: {a.auditorName}</h5>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Scope: {a.department?.name || 'Global'} &bull; Date: {new Date(a.auditDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-foreground/80 mt-1.5 italic font-medium">&quot;{a.findings}&quot;</p>
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
          <h3 className="text-lg font-bold text-foreground mb-4">Risk & Non-Compliance issues</h3>
          <div className="space-y-4">
            {issues.length === 0 ? (
              <p className="text-sm text-muted-foreground">No open compliance issues registered.</p>
            ) : (
              issues.map((issue) => (
                <div key={issue.id} className="p-4 bg-card border border-border rounded-xl flex justify-between items-center shadow-sm">
                  <div>
                    <h5 className="text-sm font-bold text-foreground">{issue.title}</h5>
                    <p className="text-xs text-muted-foreground mt-0.5">{issue.description}</p>
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
                { label: 'Passed', value: 'PASSED' },
                { label: 'Failed', value: 'FAILED' },
                { label: 'Under Review', value: 'UNDER_REVIEW' },
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
