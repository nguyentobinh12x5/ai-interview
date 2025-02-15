import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash } from "lucide-react";
import { formatDate } from "@/lib/formatDate";
import { Resume } from "@/models/resume";

interface ResumeTableProps {
  resumes: Resume[];
  onDelete: (id: number) => void;
}

const ResumeTable: React.FC<ResumeTableProps> = ({ resumes, onDelete }) => {
  return (
    <Table>
      <TableCaption>A list of your resume.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>File Name</TableHead>
          <TableHead>Document Type</TableHead>
          <TableHead>Upload Date</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {resumes.map((resume) => (
          <TableRow key={resume.id}>
            <TableCell className="font-medium">{resume.name}</TableCell>
            <TableCell>Resume</TableCell>
            <TableCell>{formatDate(resume.createdAt)}</TableCell>
            <TableCell>
              <Button
                onClick={() => onDelete(resume.id)}
                variant="outline"
                className="hover:text-red-600 hover:cursor-pointer"
              >
                <Trash />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ResumeTable;
