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
          <TabsList className="bg-black border border-gray-800">
            <TabsTrigger 
              value="pending" 
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:text-gray-400"
            >
              Pending Approvals
            </TabsTrigger>
            <TabsTrigger 
              value="approved" 
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:text-gray-400"
            >
              Approved
            </TabsTrigger>
            <TabsTrigger 
              value="rejected" 
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:text-gray-400"
            >
              Rejected
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-6">
            <Card className="bg-black border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-white">
                  {activeTab === "pending" ? "Pending Approvals" : 
                   activeTab === "approved" ? "Approved Projects" : "Rejected Projects"}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {activeTab === "pending" 
                    ? "Projects requiring review before being published" 
                    : "Projects that have been reviewed"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="py-10 text-center">
                    <p className="text-gray-400">Loading projects...</p>
                  </div>
                ) : products.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-gray-400">No {activeTab} projects found.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table className="bg-black border-gray-800">
                      <TableHeader className="bg-black">
                        <TableRow className="border-gray-800 hover:bg-black/50">
                          <TableHead className="text-gray-300">Project</TableHead>
                          <TableHead className="text-gray-300">Submitted By</TableHead>
                          <TableHead className="text-gray-300">Date</TableHead>
                          <TableHead className="text-gray-300">Status</TableHead>
                          <TableHead className="text-gray-300 text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="bg-black">
                        {products.map((product) => (
                          <TableRow key={product.id} className="border-gray-800 hover:bg-gray-900/50">
                            <TableCell className="text-gray-300">
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
                            <TableCell className="text-gray-300">
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-2 bg-gray-800 text-gray-300">
                                  <AvatarFallback className="bg-gray-800 text-gray-300">
                                    {product.submittedBy[0].toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="text-sm text-gray-300">
                                  {product.submittedBy}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-300">
                              <div className="text-sm text-gray-400">
                                {new Date(product.createdAt).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-300">
                              <Badge
                                variant={
                                  product.status === productStatus.PENDING
                                    ? "outline"
                                    : product.status === productStatus.APPROVED
                                    ? "secondary"
                                    : "destructive"
                                }
                                className="bg-transparent"
                              >
                                {product.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right text-gray-300">
                              <div className="flex justify-end items-center">
                                <div className="mr-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openDialog(product, "view")}
                                    className="border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-white"
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
                                      className="text-green-500 hover:text-green-400 hover:bg-black/50"
                                    >
                                      <Check className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => openDialog(product, "reject")}
                                      className="text-red-500 hover:text-red-400 hover:bg-black/50"
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
          <DialogContent className="max-w-3xl bg-black border-gray-800 text-white">
            {actionDialog.product && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {actionDialog.action === "view"
                      ? "Project Details"
                      : actionDialog.action === "approve"
                      ? "Approve Project"
                      : "Reject Project"}
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
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
                    <h3 className="text-lg font-semibold text-white">{actionDialog.product.name}</h3>
                    <p className="text-sm text-gray-400">{actionDialog.product.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {actionDialog.product.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="bg-transparent text-gray-300 border-gray-700">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="pt-2">
                      <p className="text-sm text-gray-300">
                        <strong className="text-gray-200">GitHub:</strong>{" "}
                        <a
                          href={actionDialog.product.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80"
                        >
                          {actionDialog.product.githubLink}
                        </a>
                      </p>
                      <p className="text-sm text-gray-300">
                        <strong className="text-gray-200">Demo:</strong>{" "}
                        <a
                          href={actionDialog.product.demoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80"
                        >
                          {actionDialog.product.demoLink}
                        </a>
                      </p>
                      <p className="text-sm text-gray-300">
                        <strong className="text-gray-200">Submitted By:</strong> {actionDialog.product.submittedBy}
                      </p>
                      <p className="text-sm text-gray-300">
                        <strong className="text-gray-200">Date:</strong>{" "}
                        {new Date(actionDialog.product.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  {actionDialog.action !== "view" ? (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={closeDialog}
                        className="border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-gray-100"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleAction}
                        disabled={updateProductMutation.isPending}
                        variant={actionDialog.action === "approve" ? "default" : "destructive"}
                        className={actionDialog.action === "approve" ? "bg-primary hover:bg-primary/80" : ""}
                      >
                        {updateProductMutation.isPending
                          ? "Processing..."
                          : actionDialog.action === "approve"
                          ? "Approve Project"
                          : "Reject Project"}
                      </Button>
                    </>
                  ) : (
                    <Button 
                      onClick={closeDialog}
                      className="bg-primary hover:bg-primary/80"
                    >
                      Close
                    </Button>
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
