import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonAnime = () => {
  return (
    <div className="max-w-[740px] w-[100%] grid gap-5 p-4 grid-cols-8">
      <div className="">
        <Skeleton className="w-[72px] h-[96px] rounded-sm" />
        <div className="mt-2 grid place-items-center">
          <Skeleton className="w-full h-[0.6rem] rounded-full" />
          <Skeleton className="w-[90%] h-[0.6rem] rounded-full mt-2" />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-5">
        <Skeleton className="w-[80%] h-[1.25rem] rounded-full" />
        <Skeleton className="w-[2rem] h-[2rem] rounded-xl" />
      </div>
      <div className="flex flex-col items-center justify-center gap-5">
        <Skeleton className="w-[80%] h-[1.25rem] rounded-full" />
        <Skeleton className="w-[2rem] h-[2rem] rounded-xl" />
      </div>
      <div className="flex flex-col items-center justify-center gap-5">
        <Skeleton className="w-[80%] h-[1.25rem] rounded-full" />
        <Skeleton className="w-[2rem] h-[2rem] rounded-xl" />
      </div>
      <div className="flex flex-col items-center justify-center gap-5">
        <Skeleton className="w-[80%] h-[1.25rem] rounded-full" />
        <Skeleton className="w-[2rem] h-[2rem] rounded-xl" />
      </div>
      <div className="flex flex-col items-center justify-center gap-5">
        <Skeleton className="w-[80%] h-[1.25rem] rounded-full" />
        <Skeleton className="w-[2rem] h-[2rem] rounded-xl" />
      </div>
      <div className="flex flex-col items-center justify-center gap-5">
        <Skeleton className="w-[80%] h-[1.25rem] rounded-full" />
        <Skeleton className="w-[2rem] h-[2rem] rounded-xl" />
      </div>
      <div className="flex flex-col items-center justify-center gap-5">
        <Skeleton className="w-[80%] h-[1.25rem] rounded-full" />
        <Skeleton className="w-[2rem] h-[2rem] rounded-xl" />
      </div>
    </div>
  );
};
