import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ViewImageProps {
  image: string;
  title: string;
}

const noPhoto =
  "http://res.cloudinary.com/dckx8pbkt/image/upload/v1698332015/iupannjd3wqb80hckmog.png";

export function ViewProof({ image, title }: ViewImageProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-16 h-16 rounded-md p-0 m-0 dark:bg-white"
        >
          <img
            src={image ?? noPhoto}
            className="w-full h-full rounded-md object-scale-down mix-blend-multiply"
            alt={""}
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex items-center justify-center w-1/4 max-sm:w-full max-sm:h-full">
        <DialogHeader>
          <DialogTitle className="py-4">{title}</DialogTitle>
          <div className="flex items-center justify-center border dark:bg-white rounded-md w-full h-full">
            <img
              alt=""
              src={image ?? noPhoto}
              className="object-scale-down rounded-md w-96 h-96 mix-blend-multiply max-sm:w-full max-sm:h-full"
            />
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
