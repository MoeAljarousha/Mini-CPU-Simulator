
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LogOut, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import AdminCarList from '@/components/admin/AdminCarList';
import AddCarForm from '@/components/admin/AddCarForm';
import AdminAuth from '@/components/admin/AdminAuth';
import AdminAppointments from '@/components/admin/AdminAppointments';
import { toast } from '@/hooks/use-toast';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingCar, setEditingCar] = useState<any>(null);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Verify admin privileges
        const { data: profile } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (profile) {
          setIsAuthenticated(true);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const handleDeleteAccount = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Delete from admin_users table
        const { error: deleteError } = await supabase
          .from('admin_users')
          .delete()
          .eq('user_id', session.user.id);

        if (deleteError) throw deleteError;

        // Sign out the user
        await supabase.auth.signOut();
        setIsAuthenticated(false);

        toast({
          title: "Account deleted",
          description: "Your admin account has been deleted successfully",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditCar = async (carId: string) => {
    // Get the car data from the cars hook
    const { data: carData } = await supabase
      .from('cars')
      .select('*')
      .eq('id', carId)
      .single();
    
    if (carData) {
      setEditingCar(carData);
      setActiveTab('add'); // Switch to the form tab
    }
  };

  const handleEditComplete = () => {
    setEditingCar(null);
    setActiveTab('list'); // Go back to list view
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminAuth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">Breeze Motors Admin</h1>
            </div>
            <Button variant="outline" onClick={handleLogout} className="text-red-500 border-red-500/50 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-lg bg-black/20 border-white/10">
            <TabsTrigger value="list" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">
              Manage Cars
            </TabsTrigger>
            <TabsTrigger value="add" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">
              {editingCar ? 'Edit Car' : 'Add New Car'}
            </TabsTrigger>
            <TabsTrigger value="appointments" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">
              Appointments
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-6">
            <AdminCarList onEditCar={handleEditCar} />
          </TabsContent>
          
          <TabsContent value="add" className="mt-6">
            <AddCarForm 
              onCarAdded={() => {
                setActiveTab('list');
                setEditingCar(null);
              }}
              editingCar={editingCar}
              onEditComplete={handleEditComplete}
            />
          </TabsContent>
          
          <TabsContent value="appointments" className="mt-6">
            <AdminAppointments />
          </TabsContent>
        </Tabs>
        
        {/* Admin Account Management */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex flex-col items-center space-y-2">
              <p className="text-sm text-gray-400">Admin Account Management</p>
              <p className="text-xs text-gray-500 text-center max-w-md">
                Permanently delete your admin account and remove all administrative access to this system.
              </p>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Admin Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Admin Account</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your admin account and remove all administrative access to this system. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                    Delete Admin Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
