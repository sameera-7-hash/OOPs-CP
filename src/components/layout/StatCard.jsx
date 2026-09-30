import React from "react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function StatCard({ label, value, note, icon: Icon, delay = 0, noteTone = "success" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="p-4 sm:p-5">
        <div className="flex items-start justify-between">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
          {Icon && (
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-4 w-4" />
            </span>
          )}
        </div>
        <strong className="mt-2 block text-2xl font-bold text-foreground">{value}</strong>
        {note && (
          <small className={cn("mt-1 block text-[11px]", noteTone === "success" ? "text-success" : "text-muted-foreground")}>
            {note}
          </small>
        )}
      </Card>
    </motion.div>
  );
}

export default StatCard;
