import { Link } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TagBadge from "@/components/tag-badge";
import { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 h-full border border-gray-200">
      <Link href={`/product/${product.id}`}>
        <a className="block h-full">
          <div className="h-48 w-full overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
            />
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
              {product.createdAt && new Date(product.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900">New</Badge>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{product.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.tags.slice(0, 3).map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
              {product.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{product.tags.length - 3} more
                </Badge>
              )}
            </div>
          </CardContent>
        </a>
      </Link>
    </Card>
  );
};

export default ProductCard;
