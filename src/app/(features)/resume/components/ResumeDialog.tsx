import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import Loading from "@/components/ui/loading";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z
  .object({
    resume: z
      .instanceof(File)
      .refine((file) => file.type === "application/pdf", {
        message: "Please upload a valid PDF file.",
      }),
  })
  .required({
    resume: true,
  });
interface ResumeDialogProps {
  onUpload: (file: File, closeDialog: () => void) => void;
  uploading: boolean;
}

const ResumeDialog: React.FC<ResumeDialogProps> = ({ onUpload, uploading }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resume: null,
    },
  });

  const handleSubmit = (values: { resume: File }) => {
    onUpload(values.resume, () => setIsDialogOpen(false));
    form.reset();
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    form.reset();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={"default"} onClick={() => setIsDialogOpen(true)}>
          <Upload />
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select your Resume or CV</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              name="resume"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                  </FormControl>
                  <FormDescription>
                    Only PDF, DOC, or DOCX files up to 10 MB
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={uploading}>
                {uploading ? <Loading /> : "Upload"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeDialog;
