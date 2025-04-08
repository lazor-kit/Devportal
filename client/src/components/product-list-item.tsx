import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import TagBadge from "@/components/tag-badge";
import { Product } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface ProductListItemProps {
  product: Product;
}

const ProductListItem = ({ product }: ProductListItemProps) => {
  const isNew = product.createdAt && new Date(product.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 flex flex-col md:flex-row">
      <div className="md:w-1/4">
        <img
          src={product.image}
          alt={product.name}
          className="h-48 w-full object-cover"
        />
      </div>
      <div className="p-4 md:w-3/4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
          {isNew && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900">New</Badge>
          )}
        </div>
        <p className="mt-2 text-sm text-gray-600">{product.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{product.submittedBy[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600">by {product.submittedBy}</span>
          </div>
          <Link href={`/product/${product.id}`}>
            <Button size="sm" className="inline-flex items-center gap-1">
              View Details
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductListItem;
