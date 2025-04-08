import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import TagBadge from "@/components/tag-badge";
import { Product } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Zap, ArrowRight } from "lucide-react";

interface ProductListItemProps {
  product: Product;
}

const ProductListItem = ({ product }: ProductListItemProps) => {
  const isNew = product.createdAt && new Date(product.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;

  return (
    <div className="card group overflow-hidden transition-all duration-300 flex flex-col md:flex-row">
      <div className="md:w-1/4 relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
      </div>
      <div className="p-5 md:w-3/4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors duration-200">
              {product.name}
            </h3>
            {isNew && (
              <Badge className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30">
                <Zap className="mr-1 h-3 w-3" /> New
              </Badge>
            )}
          </div>
          
          <p className="mt-2 text-sm text-gray-300">{product.description}</p>
          
          <div className="mt-3 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8 bg-primary/10 border border-primary/30">
                <AvatarFallback className="text-primary">{product.submittedBy[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-400">by <span className="text-white">{product.submittedBy}</span></span>
            </div>
            
            <Link href={`/product/${product.id}`}>
              <Button 
                size="sm" 
                className="inline-flex items-center gap-1 bg-black/30 text-primary hover:bg-primary/20 border border-primary/30"
              >
                View Details
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListItem;
