import { Badge } from "@/components/ui/badge";
import { ProductTag } from "@shared/schema";

interface TagColors {
  [key: string]: {
    bg: string;
    text: string;
    hoverBg: string;
    hoverText: string;
  };
}

const tagColors: TagColors = {
  defi: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    hoverBg: "hover:bg-blue-200",
    hoverText: "hover:text-blue-900",
  },
  payment: {
    bg: "bg-green-100",
    text: "text-green-800",
    hoverBg: "hover:bg-green-200",
    hoverText: "hover:text-green-900",
  },
  nft: {
    bg: "bg-pink-100",
    text: "text-pink-800",
    hoverBg: "hover:bg-pink-200",
    hoverText: "hover:text-pink-900",
  },
  dao: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    hoverBg: "hover:bg-purple-200",
    hoverText: "hover:text-purple-900",
  },
  gaming: {
    bg: "bg-red-100",
    text: "text-red-800",
    hoverBg: "hover:bg-red-200",
    hoverText: "hover:text-red-900",
  },
  wallet: {
    bg: "bg-orange-100",
    text: "text-orange-800",
    hoverBg: "hover:bg-orange-200",
    hoverText: "hover:text-orange-900",
  },
  governance: {
    bg: "bg-indigo-100",
    text: "text-indigo-800",
    hoverBg: "hover:bg-indigo-200",
    hoverText: "hover:text-indigo-900",
  },
  other: {
    bg: "bg-gray-100",
    text: "text-gray-800",
    hoverBg: "hover:bg-gray-200",
    hoverText: "hover:text-gray-900",
  },
};

interface TagBadgeProps {
  tag: ProductTag | string;
  onClick?: () => void;
  className?: string;
  active?: boolean;
}

const TagBadge = ({ tag, onClick, className = "", active = false }: TagBadgeProps) => {
  const colors = tagColors[tag] || tagColors.other;
  const baseClasses = "text-xs font-medium rounded-full transition-colors duration-200";
  const colorClasses = active 
    ? `bg-primary text-white hover:bg-primary/90` 
    : `${colors.bg} ${colors.text} ${colors.hoverBg} ${colors.hoverText}`;
  
  return (
    <Badge
      variant="secondary"
      className={`${baseClasses} ${colorClasses} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {tag.charAt(0).toUpperCase() + tag.slice(1)}
    </Badge>
  );
};

export default TagBadge;
