import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useEnvironmental } from '../../hooks/useEnvironmental';
import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '../../api/settings';
import { environmentApi } from '../../api/environment';
import { GoalCard } from '../../components/esg/GoalCard';
import { CarbonCard } from '../../components/esg/CarbonCard';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { DatePicker } from '../../components/ui/DatePicker';
import { toast } from '../../components/ui/Toast';
import { Leaf, Plus } from 'lucide-react';

const carbonSchema = zod.object({
  sourceType: zod.enum(['PURCHASE', 'MANUFACTURING', 'EXPENSE', 'FLEET'], {
    required_error: 'Source type is required',
  }),
  sourceId: zod.string().min(2, 'Identifier/Ref is required'),
  quantity: zod.coerce.number().positive('Quantity must be greater than zero'),
  unit: zod.string().min(1, 'Unit is required'),
  emissionFactorId: zod.string().min(1, 'Emission factor is required'),
  departmentId: zod.string().min(1, 'Department is required'),
  transactionDate: zod.string().min(1, 'Date is required'),
});

type CarbonFormValues = zod.infer<typeof carbonSchema>;

export function Environmental() {
  const { transactions, goals, logTransaction, isLoadingTransactions, isLoadingGoals } = useEnvironmental();
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Fetch departments
  const { data: deptsData } = useQuery({
    queryKey: ['env_departments'],
    queryFn: () => settingsApi.getDepartments(),
  });

  // Fetch emission factors for the dropdown
  const { data: factorsData } = useQuery({
    queryKey: ['env_factors_form'],
    queryFn: () => environmentApi.getFactors(),
  });

  const deptOptions = (deptsData?.data || []).map((d) => ({
    label: `${d.name} (${d.code})`,
    value: d.id,
  }));

  const factorOptions = (factorsData?.data || []).map((f: any) => ({
    label: `${f.name} (${f.factor} kg CO₂e/${f.unit})`,
    value: f.id,
  }));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CarbonFormValues>({
    resolver: zodResolver(carbonSchema),
    defaultValues: {
      unit: 'kWh',
      transactionDate: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (values: CarbonFormValues) => {
    try {
      await logTransaction(values as any);
      toast.success('Carbon transaction logged successfully.');
      setIsLogModalOpen(false);
      reset();
    } catch (err: any) {
      toast.error(err.message || 'Failed to log carbon output.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center">
            <Leaf className="h-8 w-8 mr-2.5 text-emerald-500 animate-bounce" />
            Environmental Module
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track resource footprints and greenhouse gas offsets.
          </p>
        </div>

        <Button onClick={() => setIsLogModalOpen(true)} className="flex items-center space-x-1.5">
          <Plus className="h-4 w-4" />
          <span>Log Carbon</span>
        </Button>
      </div>

      {/* Active Goals Grid */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4">Target Benchmarks</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoadingGoals ? (
            <p className="text-sm text-muted-foreground">Loading goals...</p>
          ) : goals.length === 0 ? (
            <p className="text-sm text-muted-foreground">No target goals established.</p>
          ) : (
            goals.map((goal) => <GoalCard key={goal.id} goal={goal} />)
          )}
        </div>
      </div>

      {/* Transaction Logs */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4">Carbon Emission Register</h3>
        <div className="space-y-4">
          {isLoadingTransactions ? (
            <p className="text-sm text-muted-foreground">Loading transaction logs...</p>
          ) : transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No carbon logs registered yet.</p>
          ) : (
            transactions.map((tx) => <CarbonCard key={tx.id} transaction={tx} />)
          )}
        </div>
      </div>

      {/* Log Modal */}
      <Modal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} title="Log Carbon Emissions">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <Select
            label="Emission Source Type"
            options={[
              { label: 'Select source type...', value: '' },
              { label: 'Electricity / Energy Purchase (Scope 2)', value: 'EXPENSE' },
              { label: 'Stationary Combustion / Fuel Purchase (Scope 1)', value: 'PURCHASE' },
              { label: 'Vehicle Fleet / Mobile Combustion (Scope 1)', value: 'FLEET' },
              { label: 'Manufacturing / Industrial Process (Scope 1)', value: 'MANUFACTURING' },
            ]}
            error={errors.sourceType?.message}
            {...register('sourceType')}
          />

          <Input
            label="Resource Reference / Ref"
            placeholder="Electricity Bill May 2026"
            error={errors.sourceId?.message}
            {...register('sourceId')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Quantity"
              type="number"
              step="any"
              placeholder="1200"
              error={errors.quantity?.message}
              {...register('quantity')}
            />
            <Input
              label="Unit"
              placeholder="kWh"
              error={errors.unit?.message}
              {...register('unit')}
            />
          </div>

          <Select
            label="Emission Factor"
            options={[{ label: 'Select emission factor...', value: '' }, ...factorOptions]}
            error={errors.emissionFactorId?.message}
            {...register('emissionFactorId')}
          />

          <Select
            label="Reporting Department"
            options={[{ label: 'Select Department...', value: '' }, ...deptOptions]}
            error={errors.departmentId?.message}
            {...register('departmentId')}
          />

          <DatePicker
            label="Transaction Date"
            error={errors.transactionDate?.message}
            {...register('transactionDate')}
          />

          <div className="flex items-center space-x-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsLogModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={isSubmitting}>
              Log Emissions
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Environmental;
