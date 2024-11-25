import { twMerge } from "tailwind-merge";
import { Loader, Heading } from "@babylonlabs-io/bbn-core-ui";

interface LoaderProps {
  className?: string;
  title?: string;
}

export function LoaderScreen({ className, title }: LoaderProps) {
  return (
    <div className={twMerge("b-flex b-flex-col b-items-center b-justify-center b-gap-6", className)}>
      <div className="b-flex b-items-center b-justify-center b-bg-primary-contrast b-p-6">
        <Loader />
      </div>
      {title && (
        <Heading variant="h4" className="b-capitalize">
          {title}
        </Heading>
      )}
    </div>
  );
}
