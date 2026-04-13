import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  section?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`SectionErrorBoundary [${this.props.section || "unknown"}]:`, error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-destructive mx-auto" />
          <p className="text-sm font-medium text-foreground">
            {this.props.section ? `Failed to load ${this.props.section}` : "Something went wrong"}
          </p>
          <p className="text-xs text-muted-foreground">{this.state.error?.message}</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (
                this.state.error?.message?.includes("Failed to fetch dynamically imported module") ||
                this.state.error?.message?.includes("Importing a module script failed") ||
                this.state.error?.message?.includes("dynamically imported module")
              ) {
                window.location.reload();
              } else {
                this.setState({ hasError: false, error: null });
              }
            }}
          >
            Retry
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
