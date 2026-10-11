export const switchStyles = {
  root: `
    group relative inline-flex h-6 w-11 shrink-0
    cursor-pointer items-center
    rounded-full border-0 p-0
    outline-none
    transition-colors duration-200

    bg-natural-700
    hover:bg-natural-400

    data-checked:bg-primary-500
    data-checked:hover:bg-primary-700

    data-disabled:cursor-not-allowed
    data-disabled:opacity-50

    focus-visible:ring-2
    focus-visible:ring-primary-500
    focus-visible:ring-offset-2
  `,

  thumb: `
    pointer-events-none block size-5 shrink-0
    rounded-full bg-white shadow-sm
    translate-x-0.5
    transition-transform duration-200

    ltr:group-data-[checked]:translate-x-[22px]
    rtl:group-data-[checked]:-translate-x-[22px]
  `,
};
