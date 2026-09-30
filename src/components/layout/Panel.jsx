import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function Panel({ title, description, action, className, children }) {
  return (
    <Card className={cn("mb-5", className)}>
      {(title || action) && (
        <CardHeader className="flex-row items-center justify-between">
          <div>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription className="mt-1">{description}</CardDescription>}
          </div>
          {action}
        </CardHeader>
      )}
      <CardContent className={title ? "" : "pt-5"}>{children}</CardContent>
    </Card>
  );
}

export default Panel;
