import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function Panel({ title, description, action, className, children }) {
  return (
    <Card className={cn("mb-6", className)}>
      {(title || action) && (
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-2">
          <div>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription className="mt-1">{description}</CardDescription>}
          </div>
          {action}
        </CardHeader>
      )}
      <CardContent className={title || action ? "" : "pt-6"}>{children}</CardContent>
    </Card>
  );
}

export default Panel;
