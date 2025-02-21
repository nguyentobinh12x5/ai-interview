"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";
import SuccessPopup from "./successPopup";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  occupation: string;
}

interface WaitlistDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const WaitlistDialog: React.FC<WaitlistDialogProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    occupation: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("email", formData.email);
      data.append("phoneNumber", formData.phone);
      data.append("fullName", formData.fullName);
      data.append("jobTitle", formData.occupation);

      const response = await fetch("/api/waiting-list", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        throw new Error("Failed to submit waitlist form");
      }

      onClose();
      setTimeout(() => {
        setShowSuccess(true);
      }, 100);

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        occupation: "",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
            <div className="flex items-center gap-2 mb-2">
              <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <DialogTitle className="text-xl font-semibold">
                Join Our Waitlist
              </DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground">
              Join the waitlist to be the first to experience our AI-powered
              interview prep and unlock exclusive offers.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
            <div className="grid gap-5">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="fullName" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="John Doe"
                  className="transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label="Enter your full name"
                />
              </div>

              <div className="grid w-full gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="john@example.com"
                  className="transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label="Enter your email"
                />
              </div>

              <div className="grid w-full gap-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+84 (909) 111-222"
                  className="transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label="Enter your phone number"
                />
              </div>

              <div className="grid w-full gap-1.5">
                <Label htmlFor="occupation">Job Title</Label>
                <Input
                  id="occupation"
                  required
                  value={formData.occupation}
                  onChange={(e) =>
                    setFormData({ ...formData, occupation: e.target.value })
                  }
                  placeholder="Software Engineer"
                  className="transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label="Enter your job title"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                variant={"default"}
                className="w-full"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  "Join Waitlist"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <SuccessPopup isOpen={showSuccess} onClose={handleSuccessClose} />
    </>
  );
};

export default WaitlistDialog;
