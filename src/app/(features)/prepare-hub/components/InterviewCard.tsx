import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Building2, Clock, Briefcase, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/formatDate";

interface InterviewCardProps {
  id: number;
  companyName: string;
  position: string;
  resumeName: string;
  createdAt: Date;
  onDelete: (id: number) => void;
}

const InterviewCard = ({
  id,
  companyName,
  position,
  resumeName,
  createdAt,
  onDelete,
}: InterviewCardProps) => {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Briefcase className="h-12 w-12 text-slate-600 bg-indigo-50 p-3 rounded-xl" />
            <div>
              <CardTitle className="text-xl">{position}</CardTitle>
              <div className="flex gap-2 items-center">
                <Building2 className="h-4 w-4" />
                <CardDescription>{companyName}</CardDescription>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="hover:text-red-600 hover:cursor-pointer border-none"
            onClick={() => onDelete(id)}
          >
            <Trash2 />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1 items-center">
          <FileText className="h-4" />
          <p className="text-sm"> Resume: {resumeName}</p>
        </div>
        <div className="flex gap-2 items-center mt-1">
          <Clock className="h-4" />
          <p className="text-sm">Added: {formatDate(createdAt)}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => router.push(`/prepare-hub/${id}`)}
          className="w-full"
        >
          View Q&A Detail
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InterviewCard;
