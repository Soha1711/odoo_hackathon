import { useEnvironmental } from '../../hooks/useEnvironmental';
import { DonutChart } from '../../components/charts/DonutChart';
import { StackedBarChart } from '../../components/charts/StackedBarChart';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { toast } from '../../components/ui/Toast';
import { FileBarChart, FileSpreadsheet } from 'lucide-react';

export function Reports() {
  const { transactions, isLoadingTransactions } = useEnvironmental();

  const handleDownload = () => {
    if (transactions.length === 0) {
      toast.error('No data available to export. Log some carbon transactions first.');
      return;
    }

    const headers = ['Reference', 'Source Type', 'Quantity', 'Unit', 'CO2e Emissions (kg)', 'Department', 'Date'];
    const rows = transactions.map((tx: any) => [
      tx.sourceId,
      tx.sourceType,
      tx.quantity,
      tx.unit,
      tx.calculatedEmissions?.toFixed(2) ?? '0.00',
      tx.department?.name ?? 'N/A',
      tx.transactionDate ? new Date(tx.transactionDate).toLocaleDateString() : 'N/A',
    ]);

    const csvContent = '\uFEFF' + [headers, ...rows]
      .map((row) => row.map((cell: any) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ecosphere-esg-report-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 200);

    toast.success(`ESG report exported as CSV successfully! (${transactions.length} records)`);
  };

  // Compile data for Donut Chart (Emissions by Source Type)
  const sourceTotals: Record<string, number> = {};
  transactions.forEach((tx) => {
    sourceTotals[tx.sourceType] = (sourceTotals[tx.sourceType] || 0) + (tx.calculatedEmissions ?? 0);
  });

  const donutColors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
  const donutData = Object.entries(sourceTotals).map(([name, val], idx) => ({
    name,
    value: Math.round(val),
    color: donutColors[idx % donutColors.length],
  }));

  // Stacked Bar Data from actual transactions grouped by source type
  const sourceByType: Record<string, { scope1: number; scope2: number; scope3: number }> = {};
  transactions.forEach((tx) => {
    const month = new Date(tx.transactionDate).toLocaleString('default', { month: 'short' });
    if (!sourceByType[month]) sourceByType[month] = { scope1: 0, scope2: 0, scope3: 0 };
    if (tx.sourceType === 'PURCHASE' || tx.sourceType === 'MANUFACTURING' || tx.sourceType === 'FLEET') {
      sourceByType[month].scope1 += (tx.calculatedEmissions ?? 0);
    } else if (tx.sourceType === 'EXPENSE') {
      sourceByType[month].scope2 += (tx.calculatedEmissions ?? 0);
    } else {
      sourceByType[month].scope3 += (tx.calculatedEmissions ?? 0);
    }
  });

  const stackedData = Object.entries(sourceByType).map(([name, data]) => ({
    name,
    'Scope 1': Math.round(data.scope1),
    'Scope 2': Math.round(data.scope2),
    'Scope 3': Math.round(data.scope3),
  }));

  // Table Columns
  const columns: Column<any>[] = [
    { header: 'Reference', accessorKey: 'sourceId' },
    {
      header: 'Scope Type',
      accessorKey: 'sourceType',
      cell: (item) => <span className="font-semibold text-xs tracking-wide">{item.sourceType}</span>,
    },
    {
      header: 'Quantity Logged',
      accessorKey: 'quantity',
      cell: (item) => `${item.quantity} ${item.unit}`,
    },
    {
      header: 'Calculated Impact (kg CO2e)',
      accessorKey: 'calculatedEmissions',
      cell: (item) => <span className="font-bold">{item.calculatedEmissions.toFixed(2)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center">
            <FileBarChart className="h-8 w-8 mr-2.5 text-emerald-500" />
            Compliance Reporting
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Export comprehensive carbon accounting & regulatory summaries.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            className="flex items-center space-x-1.5"
            onClick={handleDownload}
            disabled={false}
          >
            <FileSpreadsheet className="h-4.5 w-4.5" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Emission Footprint Breakdown</CardTitle>
            <CardDescription>Visual summary of total calculated CO2e emissions by scopes</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {donutData.length === 0 ? (
              <p className="text-sm text-muted-foreground py-10">No emissions logged to chart.</p>
            ) : (
              <DonutChart data={donutData} />
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Historical Quarterly Scopes</CardTitle>
            <CardDescription>Comparison of direct & indirect corporate emission scopes</CardDescription>
          </CardHeader>
          <CardContent>
            {stackedData.length === 0 ? (
              <p className="text-sm text-muted-foreground py-10 text-center">No data to chart.</p>
            ) : (
              <StackedBarChart
                data={stackedData}
                keys={['Scope 1', 'Scope 2', 'Scope 3']}
                colors={['#10b981', '#3b82f6', '#f59e0b']}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Raw emissions table */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4">Carbon Register Ledger</h3>
        <DataTable columns={columns} data={transactions} isLoading={isLoadingTransactions} />
      </div>
    </div>
  );
}

export default Reports;
