'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/components/layout/dashboard-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Admin } from '@/lib/app-data'
import { getAdmins, updateAdminStatus, deleteAdmin } from '@/actions/admin-actions'
import { toast } from 'sonner'

export default function ManageAdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const adminId = localStorage.getItem('currentAdminId');
    if (!adminId) {
      router.push('/admin/login');
      return;
    }
    fetchAdminsData();
  }, [router]);

  const fetchAdminsData = async () => {
    setLoading(true);
    const fetchedAdmins = await getAdmins();
    setAdmins(fetchedAdmins);
    setLoading(false);
  };

  const handleStatusChange = async (adminId: string, isActive: boolean) => {
    const result = await updateAdminStatus(adminId, isActive);
    if (result.success) {
      toast.success('Admin status updated successfully.');
      fetchAdminsData(); // Re-fetch to ensure UI is consistent
    } else {
      toast.error(result.message || 'Failed to update admin status.');
    }
  }

  const handleDeleteAdmin = async (adminId: string) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      const result = await deleteAdmin(adminId);
      if (result.success) {
        toast.success('Admin deleted successfully.');
        fetchAdminsData(); // Re-fetch to update the list
      } else {
        toast.error(result.message || 'Failed to delete admin.');
      }
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p>Loading admins...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader title="Manage Admins" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Admin Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {admins.length === 0 ? (
                <p>No admin accounts found.</p>
              ) : (
                admins.map((admin) => (
                  <div key={admin.id} className="flex items-center justify-between rounded-md border p-4">
                    <div>
                      <p className="font-medium">{admin.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{admin.email}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`admin-status-${admin.id}`}
                          checked={admin.isActive}
                          onCheckedChange={(checked) => handleStatusChange(admin.id, checked)}
                        />
                        <Label htmlFor={`admin-status-${admin.id}`}>Active</Label>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteAdmin(admin.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
