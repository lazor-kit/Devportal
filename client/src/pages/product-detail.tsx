import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import TagBadge from "@/components/tag-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink, ChevronLeft, Share2, Twitter } from "lucide-react";
import { Product } from "@shared/schema";
import ProductCard from "@/components/product-card";
import { useTheme } from "@/hooks/use-theme";

const ProductDetail = () => {
  const { theme } = useTheme();
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id);

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    enabled: !isNaN(productId),
  });

  // Get related products based on tags
  const { data: relatedProducts = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    enabled: !!product,
    select: (products) => 
      products
        .filter(p => 
          p.id !== productId && 
          p.tags.some(tag => product?.tags.includes(tag))
        )
        .slice(0, 3)
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <div className={`w-full max-w-4xl animate-pulse ${theme === 'light' ? 'bg-white' : ''}`}>
            <div className={`h-64 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-t-lg`}></div>
            <div className="p-6 space-y-4">
              <div className={`h-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded w-1/3`}></div>
              <div className={`h-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded w-full`}></div>
              <div className={`h-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded w-full`}></div>
              <div className={`h-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded w-3/4`}></div>
              <div className="flex space-x-2">
                <div className={`h-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded w-16`}></div>
                <div className={`h-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded w-16`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className={theme === 'light' ? 'bg-white' : ''}>
          <CardContent className="p-6">
            <div className="text-center py-10">
              <h3 className={`text-lg font-medium ${theme === 'dark' ? 'glow-text' : 'text-gray-900'}`}>Product not found</h3>
              <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                The product you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/">
                <Button className="mt-4 crypto-button">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to all projects
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isNew = product.createdAt && new Date(product.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        <Card className={`overflow-hidden ${theme === 'light' ? 'bg-white' : ''}`}>
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                className="h-64 w-full object-cover md:h-full"
                src={product.image}
                alt={product.name}
              />
            </div>
            <div className="p-6 md:w-1/2">
              <div className="flex justify-between items-start">
                <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'glow-text' : 'text-gray-900'}`}>{product.name}</h1>
                {isNew && (
                  <Badge variant="secondary" className={theme === 'dark' 
                    ? "bg-purple-900 text-purple-100 hover:bg-purple-800" 
                    : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                  }>
                    New
                  </Badge>
                )}
              </div>
              
              <div className="mt-4 flex items-center space-x-2">
                <Avatar>
                  <AvatarFallback>{product.submittedBy[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-primary' : 'text-gray-900'}`}>{product.submittedBy}</p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                    Submitted on {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <a
                    href={product.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center text-sm ${theme === 'dark' ? 'text-primary hover:text-primary-dark' : 'text-gray-700 hover:text-[#10b981]'}`}
                  >
                    <Github className="mr-1.5 h-4 w-4" />
                    GitHub Repository
                  </a>
                  <a
                    href={product.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center text-sm ${theme === 'dark' ? 'text-primary hover:text-primary-dark' : 'text-gray-700 hover:text-[#10b981]'}`}
                  >
                    <ExternalLink className="mr-1.5 h-4 w-4" />
                    Live Demo
                  </a>
                  {product.twitterLink && (
                    <a
                      href={product.twitterLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center text-sm ${theme === 'dark' ? 'text-primary hover:text-primary-dark' : 'text-gray-700 hover:text-[#10b981]'}`}
                    >
                      <Twitter className="mr-1.5 h-4 w-4" />
                      X Account
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <CardContent className={`p-6 ${theme === 'dark' ? 'border-t border-gray-800' : 'border-t border-gray-200'} space-y-6`}>
            <div>
              <h3 className={`text-lg font-medium ${theme === 'dark' ? 'glow-text' : 'text-gray-900'}`}>Description</h3>
              <div 
                className={`mt-2 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'} space-y-4 rich-text-content`}
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          </CardContent>
          
          <CardFooter className={`px-6 py-4 ${theme === 'light' ? 'bg-white' : 'bg-background'} ${theme === 'dark' ? 'border-t border-gray-800' : 'border-t border-gray-200'}`}>
            <div className="flex justify-between items-center w-full">
              <Link href="/" className={`inline-flex items-center ${theme === 'dark' ? 'text-primary hover:text-primary-dark' : 'text-gray-700 hover:text-[#10b981]'}`}>
                <ChevronLeft className="mr-1.5 h-4 w-4" />
                Back to all projects
              </Link>
              <Button variant="outline" size="sm" className="inline-flex items-center crypto-button-outline">
                <Share2 className="mr-1.5 h-4 w-4" />
                Share
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        {relatedProducts.length > 0 && (
          <Card className={theme === 'light' ? 'bg-white' : ''}>
            <CardHeader className={`${theme === 'dark' ? 'border-b border-gray-800' : 'border-b border-gray-200'}`}>
              <h3 className={`text-lg font-medium ${theme === 'dark' ? 'glow-text' : 'text-gray-900'}`}>Related Projects</h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
