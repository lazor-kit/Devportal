import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, Eye, X } from "lucide-react";
import { Product, productStatus } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface ActionDialogState {
  open: boolean;
  product: Product | null;
  action: "approve" | "reject" | "view" | null;
}

const AdminDashboard = () => {
  const [, navigate] = useLocation();
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pending");
  const [actionDialog, setActionDialog] = useState<ActionDialogState>({
    open: false,
    product: null,
    action: null,
  });

  // Redirect if not logged in or not admin
  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, loading, navigate]);

  // Fetch products based on tab
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/admin/products', { status: activeTab }],
    queryFn: async ({ queryKey }) => {
      const [baseUrl, params] = queryKey;
      const status = (params as any).status;
      const res = await apiRequest('GET', `${baseUrl}?status=${status}`);
      return res.json();
    },
    enabled: !!user?.isAdmin,
  });

  // Update product status mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/admin/products/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      
      toast({
        title: `Product ${actionDialog.action === "approve" ? "approved" : "rejected"}`,
        description: `The product has been ${actionDialog.action === "approve" ? "approved" : "rejected"} successfully.`,
      });
      
      closeDialog();
    },
    onError: (error) => {
      toast({
        title: "Action failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  const openDialog = (product: Product, action: "approve" | "reject" | "view") => {
    setActionDialog({
      open: true,
      product,
      action,
    });
  };

  const closeDialog = () => {
    setActionDialog({
      open: false,
      product: null,
      action: null,
    });
  };

  const handleAction = () => {
    if (!actionDialog.product || !actionDialog.action || actionDialog.action === "view") return;
    
    const newStatus = actionDialog.action === "approve" 
      ? productStatus.APPROVED 
      : productStatus.REJECTED;
    
    updateProductMutation.mutate({
      id: actionDialog.product.id,
      status: newStatus,
    });
  };

  // If still loading auth or not admin, show loading state
  if (loading || !user?.isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold glow-text">Admin Dashboard</h1>
          <p className="text-slate-300">Review and manage submitted projects</p>
        </div>

        <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>
                  {activeTab === "pending" ? "Pending Approvals" : 
                   activeTab === "approved" ? "Approved Projects" : "Rejected Projects"}
                </CardTitle>
                <CardDescription>
                  {activeTab === "pending" 
                    ? "Projects requiring review before being published" 
                    : "Projects that have been reviewed"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="py-10 text-center">
                    <p>Loading projects...</p>
                  </div>
                ) : products.length === 0 ? (
                  <div className="py-10 text-center">
                    <p>No {activeTab} projects found.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Project</TableHead>
                          <TableHead>Submitted By</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <img
                                    className="h-10 w-10 rounded-md object-cover"
                                    src={product.image}
                                    alt=""
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-primary">
                                    {product.name}
                                  </div>
                                  <div className="text-sm text-slate-400 line-clamp-1">
                                    {product.description}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-2">
                                  <AvatarFallback>
                                    {product.submittedBy[0].toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="text-sm text-primary">
                                  {product.submittedBy}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-slate-400">
                                {new Date(product.createdAt).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  product.status === productStatus.PENDING
                                    ? "outline"
                                    : product.status === productStatus.APPROVED
                                    ? "secondary"
                                    : "destructive"
                                }
                              >
                                {product.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end items-center">
                                <div className="mr-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openDialog(product, "view")}
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                </div>
                                
                                {product.status === productStatus.PENDING && (
                                  <div className="flex space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => openDialog(product, "approve")}
                                      className="text-green-600 hover:text-green-900"
                                    >
                                      <Check className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => openDialog(product, "reject")}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      Reject
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Action Dialog */}
        <Dialog open={actionDialog.open} onOpenChange={(open) => !open && closeDialog()}>
          <DialogContent className="max-w-3xl">
            {actionDialog.product && (
              <>
                <DialogHeader>
                  <DialogTitle>
                    {actionDialog.action === "view"
                      ? "Project Details"
                      : actionDialog.action === "approve"
                      ? "Approve Project"
                      : "Reject Project"}
                  </DialogTitle>
                  <DialogDescription>
                    {actionDialog.action === "view"
                      ? "View detailed information about this project"
                      : actionDialog.action === "approve"
                      ? "This project will be published and visible to all users"
                      : "This project will be rejected and not visible to users"}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <img
                      src={actionDialog.product.image}
                      alt={actionDialog.product.name}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{actionDialog.product.name}</h3>
                    <p className="text-sm text-slate-300">{actionDialog.product.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {actionDialog.product.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="pt-2">
                      <p className="text-sm">
                        <strong>GitHub:</strong>{" "}
                        <a
                          href={actionDialog.product.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {actionDialog.product.githubLink}
                        </a>
                      </p>
                      <p className="text-sm">
                        <strong>Demo:</strong>{" "}
                        <a
                          href={actionDialog.product.demoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {actionDialog.product.demoLink}
                        </a>
                      </p>
                      <p className="text-sm">
                        <strong>Submitted By:</strong> {actionDialog.product.submittedBy}
                      </p>
                      <p className="text-sm">
                        <strong>Date:</strong>{" "}
                        {new Date(actionDialog.product.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  {actionDialog.action !== "view" ? (
                    <>
                      <Button variant="outline" onClick={closeDialog}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleAction}
                        disabled={updateProductMutation.isPending}
                        variant={actionDialog.action === "approve" ? "default" : "destructive"}
                      >
                        {updateProductMutation.isPending
                          ? "Processing..."
                          : actionDialog.action === "approve"
                          ? "Approve Project"
                          : "Reject Project"}
                      </Button>
                    </>
                  ) : (
                    <Button onClick={closeDialog}>Close</Button>
                  )}
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminDashboard;
