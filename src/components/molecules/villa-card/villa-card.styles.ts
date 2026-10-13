
export const villaCardStyles = {
  root: `
    group relative isolate
    w-full max-w-[318px]
    aspect-[318/285]
    overflow-hidden rounded-3xl
    cursor-pointer 
  `,

  image: `
    absolute inset-0 -z-10
    size-full object-cover
    transition-transform duration-300
    group-hover:scale-105
  `,

  content: `
    absolute inset-x-4 bottom-4
    flex items-center justify-between
    gap-3 rounded-2xl
    bg-white px-[12px] py-2.5
  `,

  title: `
    min-w-0 truncate
    text-base font-medium text-black
  `,
};
