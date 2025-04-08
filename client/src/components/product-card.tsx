import { Link } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TagBadge from "@/components/tag-badge";
import { Product } from "@shared/schema";
import { Zap } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className="card border-glow group overflow-hidden h-full relative backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <Link href={`/product/${product.id}`}>
        <a className="block h-full">
          <div className="h-48 w-full overflow-hidden relative">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
          <CardContent className="p-5 relative z-10">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold glow-text line-clamp-1 group-hover:text-primary transition-colors duration-200">
                {product.name}
              </h3>
              {product.createdAt && new Date(product.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 && (
                <Badge className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30">
                  <Zap className="mr-1 h-3 w-3" /> New
                </Badge>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-300 line-clamp-2">{product.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.tags.slice(0, 3).map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
              {product.tags.length > 3 && (
                <Badge variant="outline" className="text-xs border-white/20 text-gray-400">
                  +{product.tags.length - 3} more
                </Badge>
              )}
            </div>
            
            <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                View details
              </Badge>
            </div>
          </CardContent>
        </a>
      </Link>
    </Card>
  );
};

export default ProductCard;
