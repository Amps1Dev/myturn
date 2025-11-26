"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function AdminInstitutions() {
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    branch_id: "",
    name: "",
    category: "",
    location: "",
    status: "open",
    phone: "",
    rating: 4.0,
    services: "",
    estimated_wait_time: 15
  });

  // Fixed branch options
  const branches = [
    { id: "lusaka", name: "Lusaka" },
    { id: "copperbelt", name: "Copperbelt" },
    { id: "chipata", name: "Chipata" }
  ];

  const categories = [
    "Banking",
    "Healthcare",
    "Government",
    "Telecommunications",
    "Utilities",
    "Retail",
    "Education"
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    // Load institutions
    const { data: institutionData } = await supabase
      .from('institutions')
      .select('*')
      .order('name');
    
    setInstitutions(institutionData || []);
    setLoading(false);
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.branch_id) {
      toast.error("Please select a branch");
      return;
    }
    if (!formData.name) {
      toast.error("Please enter institution name");
      return;
    }
    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }
    if (!formData.location) {
      toast.error("Please enter location");
      return;
    }
    if (!formData.services) {
      toast.error("Please enter services");
      return;
    }

    // Parse services from comma-separated string
    const servicesArray = formData.services
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const { error } = await supabase
      .from('institutions')
      .insert({
        branch_id: formData.branch_id,
        name: formData.name,
        category: formData.category,
        location: formData.location,
        status: formData.status,
        phone: formData.phone,
        rating: formData.rating,
        services: servicesArray,
        estimated_wait_time: formData.estimated_wait_time,
        current_queue_count: 0
      });

    if (error) {
      toast.error(`Failed to create institution: ${error.message || 'Unknown error'}`);
      console.error('Supabase error:', error);
    } else {
      toast.success("Institution created successfully!");
      setShowForm(false);
      setFormData({
        branch_id: "",
        name: "",
        category: "",
        location: "",
        status: "open",
        phone: "",
        rating: 4.0,
        services: "",
        estimated_wait_time: 15
      });
      loadData();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this institution?")) return;

    const { error } = await supabase
      .from('institutions')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Failed to delete institution");
    } else {
      toast.success("Institution deleted");
      loadData();
    }
  };

  // Helper function to get branch name by id
  const getBranchName = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.name : branchId;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Institutions</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Institution
        </Button>
      </div>

      {/* Add Institution Form */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Institution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Branch *</label>
                  <select
                    value={formData.branch_id}
                    onChange={(e) => setFormData({...formData, branch_id: e.target.value})}
                    className="w-full p-2 border rounded bg-white"
                  >
                    <option value="">Select Branch</option>
                    {branches.map(branch => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Institution Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="e.g., Zanaco Bank - Cairo Road"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full p-2 border rounded bg-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="e.g., Cairo Road, Lusaka"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="+260 XXX XXX XXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full p-2 border rounded bg-white"
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="busy">Busy</option>
                    <option value="break">Break</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Rating (0-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Est. Wait Time (mins)</label>
                  <input
                    type="number"
                    value={formData.estimated_wait_time}
                    onChange={(e) => setFormData({...formData, estimated_wait_time: parseInt(e.target.value)})}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Services (comma-separated) *
                  </label>
                  <input
                    type="text"
                    value={formData.services}
                    onChange={(e) => setFormData({...formData, services: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="e.g., Account Opening, Loans, General Banking"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separate multiple services with commas
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSubmit}>
                  Create Institution
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Institutions List */}
      <div className="grid gap-4">
        {institutions.map((institution) => (
          <Card key={institution.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{institution.name}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <p><strong>Category:</strong> {institution.category}</p>
                    <p><strong>Status:</strong> <span className="capitalize">{institution.status}</span></p>
                    <p><strong>Location:</strong> {institution.location}</p>
                    <p><strong>Phone:</strong> {institution.phone || 'N/A'}</p>
                    <p><strong>Rating:</strong> {institution.rating} / 5</p>
                    <p><strong>Queue:</strong> {institution.current_queue_count} people</p>
                    <p><strong>Wait Time:</strong> {institution.estimated_wait_time} mins</p>
                    <p><strong>Branch:</strong> {getBranchName(institution.branch_id)}</p>
                  </div>
                  <div className="mt-2">
                    <strong className="text-sm">Services:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(institution.services || []).map((service: string, idx: number) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(institution.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {institutions.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center text-gray-500">
              No institutions found. Click "Add Institution" to create one.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}