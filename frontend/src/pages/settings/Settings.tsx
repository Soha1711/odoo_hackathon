import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { settingsApi } from '../../api/settings';
import { environmentApi } from '../../api/environment';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { toast } from '../../components/ui/Toast';
import { Settings as SettingsIcon, Plus, Building2 } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';

const deptSchema = zod.object({
  name: zod.string().min(2, 'Department name is required'),
  code: zod.string().min(2, 'Code is required'),
  head: zod.string().min(2, 'Head is required'),
  employeeCount: zod.coerce.number().nonnegative('Count must be zero or more'),
});

type DeptFormValues = zod.infer<typeof deptSchema>;

export function Settings() {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);

  const isManagement = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  // Fetch departments list
  const { data: deptsData, isLoading: isLoadingDepts } = useQuery({
    queryKey: ['settings_departments'],
    queryFn: () => settingsApi.getDepartments(),
  });

  // Fetch emission factors list
  const { data: factorsData, isLoading: isLoadingFactors } = useQuery({
    queryKey: ['settings_factors'],
    queryFn: () => environmentApi.getFactors(),
  });

  // Create Department mutation
  const createDeptMutation = useMutation({
    mutationFn: (data: any) => settingsApi.createDepartment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings_departments'] });
      toast.success('Department created successfully!');
      setIsDeptModalOpen(false);
      resetDept();
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to create department.');
    },
  });

  const {
    register: registerDept,
    handleSubmit: handleSubmitDept,
    reset: resetDept,
    formState: { errors: deptErrors },
  } = useForm<DeptFormValues>({
    resolver: zodResolver(deptSchema),
  });

  const onDeptSubmit = (values: DeptFormValues) => {
    createDeptMutation.mutate(values);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center">
          <SettingsIcon className="h-8 w-8 mr-2.5 text-primary" />
          Settings Panel
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Adjust platform preferences, configure departments, and manage emission conversion factors.
        </p>
      </div>

      <Tabs defaultValue="departments" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="factors">Emission Factors</TabsTrigger>
        </TabsList>

        {/* Departments Tab */}
        <TabsContent value="departments" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-foreground">Registered Departments</h3>
            {isManagement && (
              <Button onClick={() => setIsDeptModalOpen(true)} className="flex items-center space-x-1.5">
                <Plus className="h-4.5 w-4.5" />
                <span>Add Department</span>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoadingDepts ? (
              <p className="text-sm text-muted-foreground">Loading departments...</p>
            ) : (deptsData?.data || []).length === 0 ? (
              <p className="text-sm text-muted-foreground">No departments registered.</p>
            ) : (
              (deptsData?.data || []).map((dept) => (
                <div key={dept.id} className="p-5 bg-card border border-border rounded-xl flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-foreground">{dept.name}</h4>
                      <span className="text-[10px] bg-secondary text-secondary-foreground font-bold px-1.5 py-0.5 rounded-full border border-border">
                        {dept.code}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Head: {dept.head || 'N/A'}</p>
                    <p className="text-xs text-muted-foreground">Employees: {dept.employeeCount || 0}</p>
                  </div>
                  <Building2 className="h-8 w-8 text-muted-foreground/35" />
                </div>
              ))
            )}
          </div>
        </TabsContent>

        {/* Emission Factors Tab */}
        <TabsContent value="factors" className="space-y-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Emissions Conversion Table</h3>
          <div className="space-y-4">
            {isLoadingFactors ? (
              <p className="text-sm text-muted-foreground">Loading conversion factors...</p>
            ) : (factorsData?.data || []).length === 0 ? (
              <p className="text-sm text-muted-foreground">No custom factors registered. Using platform defaults.</p>
            ) : (
              (factorsData?.data || []).map((factor: any) => (
                <div key={factor.id} className="p-4 bg-card border border-border rounded-xl flex items-center justify-between shadow-sm">
                  <div>
                    <h5 className="text-sm font-semibold text-foreground">{factor.name}</h5>
                    <p className="text-xs text-muted-foreground mt-0.5">Source Type: {factor.sourceType}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold text-foreground">{factor.factor.toFixed(4)}</span>
                    <span className="text-[9px] font-semibold text-muted-foreground block">
                      kg CO₂e per {factor.unit}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Department Modal */}
      <Modal isOpen={isDeptModalOpen} onClose={() => setIsDeptModalOpen(false)} title="Create New Department">
        <form onSubmit={handleSubmitDept(onDeptSubmit)} className="space-y-4 pt-2">
          <Input
            label="Department Name"
            placeholder="Human Resources"
            error={deptErrors.name?.message}
            {...registerDept('name')}
          />

          <Input
            label="Department Code"
            placeholder="HR"
            error={deptErrors.code?.message}
            {...registerDept('code')}
          />

          <Input
            label="Department Head Name"
            placeholder="Alice Johnson"
            error={deptErrors.head?.message}
            {...registerDept('head')}
          />

          <Input
            label="Employee Count"
            type="number"
            placeholder="12"
            error={deptErrors.employeeCount?.message}
            {...registerDept('employeeCount')}
          />

          <div className="flex items-center space-x-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsDeptModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={createDeptMutation.isPending}>
              Create Department
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Settings;
