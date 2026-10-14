import { Sparkles, PlusCircle, MinusCircle, Layers } from 'lucide-react';

interface TopicIconProps {
  name: string;
  size?: number;
}

export const TopicIcon = ({ name, size = 18 }: TopicIconProps) => {
  switch (name) {
    case 'PlusCircle':
      return <PlusCircle size={size} />;
    case 'MinusCircle':
      return <MinusCircle size={size} />;
    case 'Layers':
      return <Layers size={size} />;
    default:
      return <Sparkles size={size} />;
  }
};
