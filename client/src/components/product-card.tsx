import { Link } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TagBadge from "@/components/tag-badge";
import { Product, Dapp } from "@shared/schema";
import { Zap, ExternalLink, Github, Twitter } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

interface DappCardProps {
  product: Product | Dapp;
}

const DappCard = ({ product }: DappCardProps) => {
  const { theme } = useTheme();
  return (
    <Card className="dapp-card group overflow-hidden h-full relative">
      <Link href={`/product/${product.id}`} className="block h-full">
        <div className="h-48 w-full overflow-hidden relative">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        </div>
        <CardContent className="p-5 relative z-10">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold solana-text line-clamp-1 transition-colors duration-200">
              {product.name}
            </h3>
            {product.createdAt && new Date(product.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 && (
              <Badge className="bg-[#14f195]/20 text-[#14f195] border border-[#14f195]/30 hover:bg-[#14f195]/30">
                <Zap className="mr-1 h-3 w-3" /> New
              </Badge>
            )}
          </div>
          <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} line-clamp-2`}>{product.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
            {product.tags.length > 3 && (
              <Badge 
                variant="outline" 
                className={`text-xs ${theme === 'dark' 
                  ? 'border-white/20 text-gray-400' 
                  : 'border-gray-200 text-gray-500'
                }`}
              >
                +{product.tags.length - 3} more
              </Badge>
            )}
          </div>
          
          <div className={`flex gap-2 mt-4 pt-3 ${theme === 'dark' 
            ? 'border-t border-white/10' 
            : 'border-t border-gray-200'
          }`}>
            <div className={`flex items-center space-x-2 text-xs ${theme === 'dark' 
              ? 'text-gray-400'
              : 'text-gray-500'
            }`}>
              <ExternalLink className="h-3 w-3" />
              <span>Live dApp</span>
            </div>
            {product.githubLink && (
              <div className={`flex items-center space-x-2 text-xs ${theme === 'dark' 
                ? 'text-gray-400'
                : 'text-gray-500'
              }`}>
                <Github className="h-3 w-3" />
                <span>GitHub</span>
              </div>
            )}
          </div>
          
          <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Badge variant="outline" className="bg-[#9945ff]/10 text-[#9945ff] border-[#9945ff]/20">
              View details
            </Badge>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default DappCard;
