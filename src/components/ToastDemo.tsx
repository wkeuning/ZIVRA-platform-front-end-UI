import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

export function ToastDemo() {
  const { toast } = useToast();

  const showSuccessToast = () => {
    toast({
      variant: "success",
      title: "Success!",
      description: "Your action was completed successfully.",
    });
  };

  const showErrorToast = () => {
    toast({
      variant: "destructive",
      title: "Error!",
      description: "Something went wrong. Please try again.",
    });
  };

  const showWarningToast = () => {
    toast({
      variant: "warning",
      title: "Warning!",
      description: "Please check your input before proceeding.",
    });
  };

  const showInfoToast = () => {
    toast({
      variant: "info",
      title: "Information",
      description: "Here's some helpful information for you.",
    });
  };

  const showActionToast = () => {
    toast({
      title: "File deleted",
      description: "Your file has been moved to trash.",
      action: <ToastAction altText="Undo">Undo</ToastAction>,
    });
  };

  const showDefaultToast = () => {
    toast({
      title: "Default Toast",
      description: "This is a default toast notification.",
    });
  };

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold">Toast Demo</h2>
      <p className="text-muted-foreground">
        Click the buttons below to see different toast notifications in action.
      </p>

      <div className="flex flex-wrap gap-2">
        <Button onClick={showSuccessToast} variant="default">
          Success Toast
        </Button>
        <Button onClick={showErrorToast} variant="destructive">
          Error Toast
        </Button>
        <Button onClick={showWarningToast} variant="outline">
          Warning Toast
        </Button>
        <Button onClick={showInfoToast} variant="secondary">
          Info Toast
        </Button>
        <Button onClick={showActionToast} variant="outline">
          Action Toast
        </Button>
        <Button onClick={showDefaultToast} variant="ghost">
          Default Toast
        </Button>
      </div>
    </div>
  );
}
