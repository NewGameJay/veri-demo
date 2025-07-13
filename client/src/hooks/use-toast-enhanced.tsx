import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from 'lucide-react';
import { XCircle } from 'lucide-react';
import { Info } from 'lucide-react';

export function useToastEnhanced() {
  const { toast } = useToast();

  const showSuccess = (message: string) => {
    toast({
      title: "Success",
      description: message,
      duration: 3000,
      className: "border-green-500 bg-green-50 text-green-900",
    });
  };

  const showError = (message: string) => {
    toast({
      title: "Error",
      description: message,
      duration: 5000,
      className: "border-red-500 bg-red-50 text-red-900",
    });
  };

  const showInfo = (message: string) => {
    toast({
      title: "Info",
      description: message,
      duration: 3000,
      className: "border-blue-500 bg-blue-50 text-blue-900",
    });
  };

  return {
    showSuccess,
    showError,
    showInfo,
  };
}
