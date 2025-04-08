import { Badge } from "@/components/ui/badge";
import { ProductTag } from "@shared/schema";

interface TagColors {
  [key: string]: {
    bg: string;
    text: string;
    border: string;
    hoverBg: string;
    hoverText: string;
    icon?: React.ReactNode;
  };
}

// Import all the icons we need
import { 
  CircleDollarSign, 
  Wallet, 
  Layers, 
  Gamepad2, 
  ShieldCheck, 
  Users, 
  Component, 
  Tag 
} from "lucide-react";

const tagColors: TagColors = {
  defi: {
    bg: "bg-blue-950/40",
    text: "text-blue-400",
    border: "border-blue-500/30",
    hoverBg: "hover:bg-blue-900/50",
    hoverText: "hover:text-blue-300",
    icon: <CircleDollarSign className="h-3 w-3 mr-1" />,
  },
  payment: {
    bg: "bg-emerald-950/40",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    hoverBg: "hover:bg-emerald-900/50",
    hoverText: "hover:text-emerald-300",
    icon: <CircleDollarSign className="h-3 w-3 mr-1" />,
  },
  nft: {
    bg: "bg-fuchsia-950/40",
    text: "text-fuchsia-400",
    border: "border-fuchsia-500/30",
    hoverBg: "hover:bg-fuchsia-900/50",
    hoverText: "hover:text-fuchsia-300",
    icon: <Layers className="h-3 w-3 mr-1" />,
  },
  dao: {
    bg: "bg-purple-950/40",
    text: "text-purple-400",
    border: "border-purple-500/30",
    hoverBg: "hover:bg-purple-900/50",
    hoverText: "hover:text-purple-300",
    icon: <Users className="h-3 w-3 mr-1" />,
  },
  gaming: {
    bg: "bg-red-950/40",
    text: "text-red-400",
    border: "border-red-500/30",
    hoverBg: "hover:bg-red-900/50",
    hoverText: "hover:text-red-300",
    icon: <Gamepad2 className="h-3 w-3 mr-1" />,
  },
  wallet: {
    bg: "bg-amber-950/40",
    text: "text-amber-400",
    border: "border-amber-500/30",
    hoverBg: "hover:bg-amber-900/50",
    hoverText: "hover:text-amber-300",
    icon: <Wallet className="h-3 w-3 mr-1" />,
  },
  governance: {
    bg: "bg-indigo-950/40",
    text: "text-indigo-400",
    border: "border-indigo-500/30",
    hoverBg: "hover:bg-indigo-900/50",
    hoverText: "hover:text-indigo-300",
    icon: <ShieldCheck className="h-3 w-3 mr-1" />,
  },
  other: {
    bg: "bg-gray-950/40",
    text: "text-gray-400",
    border: "border-gray-500/30",
    hoverBg: "hover:bg-gray-900/50",
    hoverText: "hover:text-gray-300",
    icon: <Tag className="h-3 w-3 mr-1" />,
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
  
  // Define the base classes
  const baseClasses = "text-xs font-medium rounded-full px-2.5 py-0.5 transition-all duration-200 border flex items-center";
  
  // Define the color classes based on active state
  const colorClasses = active 
    ? `bg-primary/20 text-primary border-primary/40 hover:bg-primary/30` 
    : `${colors.bg} ${colors.text} ${colors.border} ${colors.hoverBg} ${colors.hoverText}`;
  
  return (
    <Badge
      variant="outline"
      className={`${baseClasses} ${colorClasses} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {!active && colors.icon}
      {active && <Component className="h-3 w-3 mr-1" />}
      {tag.charAt(0).toUpperCase() + tag.slice(1)}
    </Badge>
  );
};

export default TagBadge;
