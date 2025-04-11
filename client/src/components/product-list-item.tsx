import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import TagBadge from "@/components/tag-badge";
import { Product } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Zap, ArrowRight } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

interface ProductListItemProps {
  product: Product;
}

const ProductListItem = ({ product }: ProductListItemProps) => {
  const isNew = product.createdAt && new Date(product.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;
  const { theme } = useTheme();

  return (
    <div className={`card group overflow-hidden transition-all duration-300 flex flex-col md:flex-row hover:translate-y-[-5px] ${
      theme === 'dark' ? 'bg-black/30' : 'bg-white shadow-md'
    }`}>
      <div className="md:w-1/4 relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
      </div>
      <div className="p-5 md:w-3/4 relative">
        <div className={`absolute inset-0 bg-gradient-to-r ${
          theme === 'dark' 
            ? 'from-[#9945ff]/5 to-transparent' 
            : 'from-[#9945ff]/5 to-transparent'
        } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <h3 className={`text-lg font-semibold ${
              theme === 'dark'
                ? 'solana-text' 
                : 'solana-text'
            } line-clamp-1 transition-colors duration-200`}>
              {product.name}
            </h3>
            {isNew && (
              <Badge className={theme === 'dark' 
                ? "bg-[#9945ff]/20 text-[#9945ff] border border-[#9945ff]/30 hover:bg-[#9945ff]/30"
                : "bg-[#9945ff]/10 text-[#9945ff] border border-[#9945ff]/20 hover:bg-[#9945ff]/20"
              }>
                <Zap className="mr-1 h-3 w-3" /> New
              </Badge>
            )}
          </div>
          
          <p className={`mt-2 text-sm ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>{product.description}</p>
          
          <div className="mt-3 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8 bg-[#9945ff]/10 border border-[#9945ff]/30">
                <AvatarFallback className="text-[#9945ff]">{product.submittedBy[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                by <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  {product.submittedBy}
                </span>
              </span>
            </div>
            
            <Link href={`/product/${product.id}`}>
              <Button 
                size="sm" 
                className={`inline-flex items-center gap-1 ${
                  theme === 'dark'
                    ? 'bg-black/30 text-[#9945ff] hover:bg-[#9945ff]/20 border border-[#9945ff]/30'
                    : 'bg-white text-[#9945ff] hover:bg-[#9945ff]/10 border border-[#9945ff]/20'
                }`}
              >
                View Details
                <ArrowRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1 animate-gentle-bounce" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListItem;
