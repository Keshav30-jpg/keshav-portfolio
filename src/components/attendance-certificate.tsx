import { Eye } from "lucide-react";
import certificateAsset from "@/assets/masai-attendance-certificate.png.asset.json";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function AttendanceCertificate() {
  return (
    <div className="mt-5 flex flex-col items-start gap-3">
      <p className="max-w-full rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground">Class attendance · Certificate of Total Engagement</p>
      <p className="text-sm text-muted-foreground">Certificate ID: <span className="font-mono font-semibold text-foreground">EBqRcq7cGL</span></p>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="h-auto min-h-10 whitespace-normal py-3"><Eye size={16} />View Attendance Certificate</Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-5xl overflow-y-auto rounded-lg p-4 sm:p-6">
          <DialogHeader className="pr-7 text-left">
            <DialogTitle className="leading-snug">Certificate of Total Engagement</DialogTitle>
            <DialogDescription>Applied AI &amp; ML Essentials · Vishlesan i-Hub, IIT Patna × Masai</DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Certificate ID: <span className="font-mono font-semibold text-foreground">EBqRcq7cGL</span></p>
          <img src={certificateAsset.url} alt="Keshav S’s Certificate of Total Engagement in the Artificial Intelligence and Machine Learning program from Vishlesan i-Hub, IIT Patna in collaboration with Masai" width={1087} height={768} className="h-auto w-full" />
        </DialogContent>
      </Dialog>
    </div>
  );
}