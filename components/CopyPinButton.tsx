'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

interface CopyPinButtonProps {
  pin: string;
}

const CopyPinButton: React.FC<CopyPinButtonProps> = ({ pin }) => {
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pin)
      .then(() => {
        toast({
          title: "PIN Copied",
          description: "The game PIN has been copied to your clipboard.",
        });
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
        toast({
          title: "Copy Failed",
          description: "Failed to copy PIN to clipboard. Please try again.",
          variant: "destructive",
        });
      });
  };

  return (
    <Button onClick={copyToClipboard} variant="outline" size="sm">
      <Copy className="mr-2 h-4 w-4" />
      Copy PIN
    </Button>
  );
};

export default CopyPinButton;