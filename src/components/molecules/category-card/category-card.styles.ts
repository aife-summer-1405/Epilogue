export const categoryCardStyles = {
  root: `
    relative isolate
    w-full
    aspect-[220/290]
    overflow-hidden rounded-[16px] 
    bg-natural-200
  `,

  image: `
    absolute inset-0 -z-10
    size-full object-cover
  `,

  content: `
    absolute inset-x-5 bottom-5
    flex items-center justify-between
    gap-3 rounded-[16px]
    bg-white dark:bg-[#353535] dark:text-white px-3 py-2.5 
  `,

  title: `
    min-w-0 truncate
    text-base font-bold text-black
  `,
};
